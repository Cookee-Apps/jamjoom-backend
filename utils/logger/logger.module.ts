import { Module, Global } from '@nestjs/common';
import { Logger } from './logger.service';
import { LogInterceptor } from './interceptors/log.interceptor';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger.config';

@Global()
@Module({
  providers: [Logger, LogInterceptor],
  imports: [WinstonModule.forRoot(winstonConfig)],
  exports: [Logger],
})
export class LoggerModule {}
