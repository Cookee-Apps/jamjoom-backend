import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'utils/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AllExceptionsFilter } from 'utils/exception-filters/exception-filter';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { setupSwagger } from 'utils/swagger/swagger.config';
import { CacheService } from 'utils/cache/cache.service';
import { Command } from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const allowedOrigins = [
    configService.get('FRONTEND_URL'), 
    configService.get('DASHBOARD_URL'), 
    configService.get('STORE_DASHBOARD_URL')
  ];
  const logger = app.get(Logger);
  const devMode = configService.get('NODE_ENV') === 'development';
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const corsOptions: CorsOptions = {
    origin: allowedOrigins,
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Accept, Authorization, cache-control, x-refresh-token',
    credentials: true,
  };

  if (!devMode) app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(logger, configService));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });


  if (devMode) {
    setupSwagger(app, configService);
    corsOptions.origin = '*';
    const cacheService = app.get(CacheService)
    await cacheService.initRedis()
  }

  app.enableCors(corsOptions);
  await app.listen(port);

  const backendURL: string = configService.get('BACKEND_URL')!;
  logger.log(`Application is running on: ${backendURL}`);
  if (devMode) {
    logger.log(`Admin Swagger available at: ${backendURL}/docs/admin`);
    logger.log(`Customer Swagger available at: ${backendURL}/docs/customer`);
    logger.log(`Store Swagger available at: ${backendURL}/docs/store`);
    logger.log(`Driver Swagger available at: ${backendURL}/docs/driver`);
  }
}
bootstrap();
