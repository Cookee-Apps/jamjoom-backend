// src/common/interceptors/log.interceptor.ts

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Logger } from '../logger.service';
import { RequestWithUser } from 'src/auth/types/request_with_user';
import { Request } from 'express';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: Logger) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<RequestWithUser & Request>();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const user = req.user?.id || 'Anonymous';
    const username = req.user?.username || 'No Username';
    const ip = req.ip || req.connection?.remoteAddress || 'Unknown IP';

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const duration = Date.now() - now;
        this.loggerService.log(
          `[${method}] - ip: [${ip}] ${url} - User: ${user} ${username} - Status: ${statusCode} - ${duration}ms`,
        );
      }),
    );
  }
}

export const LogRequest = () => UseInterceptors(LogInterceptor);
