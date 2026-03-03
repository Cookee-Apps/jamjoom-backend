import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { Logger } from 'utils/logger/logger.service';
import { PrismaExceptionHandler } from './prisma.exception-filter';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private isDevelopmentMode = process.env.NODE_ENV === 'development';

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) { }

  catch(exception: HttpException | BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientRustPanicError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      PrismaExceptionHandler.handle(
        exception,
        host,
        this.logger,
        this.configService,
      );
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '';
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as any;
      if (
        Array.isArray(exceptionResponse?.message) &&
        exceptionResponse?.message?.length > 0
      ) {
        message = exceptionResponse.message.join(', ');
      }
      else {
        message = exceptionResponse?.message || exception.message;
      }
    }
    if (!message) message = 'Something went wrong';

    if (
      exception.getStatus &&
      exception.getStatus() === HttpStatus.TOO_MANY_REQUESTS
    ) {
      message = 'Try again after 1 minute';
    }
    let userName = (request as any).user?.id ?? 'Anonymous';
    const loggingEnabled = this.configService.get('FILE_LOGGING_ENABLED');
    if (loggingEnabled) {
      if (exception.stack) {
        this.logger.error(exception.stack);
      }
      this.logger.error(
        `[${request.method}] - ip: [${request.ip}] ${request.url} - User: ${userName} - ${request.headers['user-agent']}`,
      );
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
