import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from './cache.service';
import { Logger } from 'utils/logger/logger.service';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from 'src/auth/types/request_with_user';
import { ConfigService } from '@nestjs/config';

export const CacheTTL = Reflector.createDecorator<number>();

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: Logger,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUser & Request>();



    if (request.method !== 'GET') {
      return next.handle();
    }

    // Skip caching if route has @NoCache
    let noCache = this.reflector.get<boolean>(NO_CACHE, context.getHandler());
    const cacheControl = request.headers['cache-control']
    if (cacheControl === 'no-cache') noCache = true
    if (noCache) {
      this.logger.log(`No Cache: ${request.originalUrl}`);
      return next.handle();
    }

    const key = this.generateCacheKey(request);
    const cached = await this.cacheService.get(key);

    const cachingEnabled =
      this.configService.get<string>('CONTROLLER_CACHING_ENABLED') === 'true';
    if (cached && cachingEnabled) {
      this.logger.log(`${key} Cache Hit`);
      return of(cached);
    }
    let ttl = 60; // default TTL in seconds
    const cacheTTL = this.reflector.get<number | undefined>(
      CacheTTL,
      context.getHandler(),
    );
    if (cacheTTL) ttl = cacheTTL;

    this.logger.log(`Cache Miss: ${request.originalUrl}`);
    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheService.set(key, response, ttl);
      }),
    );
  }

  private generateCacheKey(req: RequestWithUser & Request): string {
    let url = req.originalUrl || req.url;
    let userId = req.user?.id || '';
    return `response:GET:${userId ? userId + ':' : ''}${url}`;
  }
}

import { SetMetadata } from '@nestjs/common';

const NO_CACHE = 'no-cache';
export const NoCache = () => SetMetadata(NO_CACHE, true);
