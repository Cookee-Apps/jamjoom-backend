import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { Logger } from 'utils/logger/logger.service';
import { ConfigService } from '@nestjs/config';

export class PrismaExceptionHandler {
  static isDevelopmentMode = process.env.NODE_ENV === 'development';

  static handle(
    exception: any,
    host: ArgumentsHost,
    logger: Logger,
    configService: ConfigService,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          statusCode = HttpStatus.CONFLICT;
          message = `Unique constraint failed on: ${(exception.meta?.target as any)?.join(', ')}`;
          break;
        case 'P2025':
          statusCode = HttpStatus.NOT_FOUND;
          message = `Record not found: ${exception.meta?.cause || 'Unknown cause'}`;
          break;
        case 'P2003':
          statusCode = HttpStatus.BAD_REQUEST;
          message = `Foreign key constraint failed on: ${exception.meta?.field_name}`;
          break;
        case 'P2000':
          statusCode = HttpStatus.BAD_REQUEST;
          message = `Value too long for column: ${exception.meta?.column_name}`;
          break;
        default:
          statusCode = HttpStatus.BAD_REQUEST;
          message = exception.message;
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Invalid input provided to Prisma Client.';
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Prisma Client failed to initialize. Check your database connection.';
    } else if (exception instanceof Prisma.PrismaClientRustPanicError) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Prisma engine crashed. Please check logs or restart the server.';
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unknown error occurred while processing the database request.';
    }
    
    const userName = (request as any).user?.id ?? 'Anonymous';
    const loggingEnabled = configService.get('FILE_LOGGING_ENABLED');
    if (loggingEnabled) {
      logger.error(
        `[${request.method}] - ip: [${request.ip}] ${request.url} - User: ${userName} - ${message}`,
      );
    }
    // Environment-aware error message
    if (!this.isDevelopmentMode) {
      message = 'Something went wrong';
    }


    response.status(statusCode).json({
      statusCode,
      message,
      error: exception.name || 'PrismaException',
    });
  }
}
