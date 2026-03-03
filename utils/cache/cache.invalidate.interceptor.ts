import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { CacheService } from './cache.service';
import { Reflector } from '@nestjs/core';
import { Logger } from 'utils/logger/logger.service';
import { Observable, tap } from 'rxjs';
import { RequestWithUser } from 'src/auth/types/request_with_user';

const InvalidateCache = Reflector.createDecorator<string | string[]>();

@Injectable()
export class InvalidateCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: Logger,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request & RequestWithUser>();
    if (request.method === 'GET') {
      return next.handle();
    }
    const ControllerClass = context.getClass();
    const controllerRoute = this.reflector.get<string>('path', ControllerClass);
    const prefix = this.reflector.get(InvalidateCache, context.getHandler());
    let cacheKeys: string[] = [];
    if (Array.isArray(prefix)) {
      for (const eachCar of prefix) {
        cacheKeys.push(this.getCacheKeyPrefix(controllerRoute, eachCar, request.user?.id));
      }
    } else {
      cacheKeys = [this.getCacheKeyPrefix(controllerRoute, prefix, request.user?.id)];
    }
    return next.handle().pipe(
      tap(async () => {
        cacheKeys.forEach((each) => {
          this.cacheService
            .deleteByPrefix(each)
            .then(() => this.logger.log(`Cache invalidated for ${each}`))
            .catch(() => {});
        });
      }),
    );
  }

  private getCacheKeyPrefix(controllerRoute: string, prefix: string, userId?: string) {
    let key = `response:GET:${userId ? `${userId}:` : ''}/${[controllerRoute, prefix].filter(Boolean).join('/')}`.replace(
      /\/+/g,
      '/',
    );
    return key
  }
}

export const InvalidateRouteCache = (prefix: string | string[]) =>
  applyDecorators(
    InvalidateCache(prefix),
    UseInterceptors(InvalidateCacheInterceptor),
  );
