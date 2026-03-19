import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor } from 'utils/cache/cache.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'utils/logger/logger.module';
import { SharedCacheModule } from 'utils/cache/cache.module';
import { DatabaseModule } from 'utils/db/db.module';
import { EventEmitterModule } from 'utils/event-emitter/event-emitters.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoleModule } from './roles/role.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { FileUploadModule } from 'utils/file-upload/file-upload.module';
import { CustomersModule } from './customers/customers.module';
import { SessionModule } from './session/session.module';
import { StoresModule } from './stores/stores.module';
import { BannersModule } from './banners/banners.module';
import { ComplaintCategoriesModule } from './complaint-categories/complaint-categories.module';
import { ComplaintsModule } from './complaints/complaints.module';

import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLING_TTL') || 60,
          limit: config.get<number>('THROTTLING_REQUESTS_LIMIT') || 10,
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: 'uploads',
      serveRoot: '/uploads',
    }),
    RoleModule,
    LoggerModule,
    SharedCacheModule,
    DatabaseModule,
    EventEmitterModule,
    AuthModule,
    UsersModule,
    ConfigurationModule,
    FileUploadModule,
    CustomersModule,
    SessionModule,
    StoresModule,
    BannersModule,
    ComplaintCategoriesModule,
    ComplaintsModule,

  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule { }
