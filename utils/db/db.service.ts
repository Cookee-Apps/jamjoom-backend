import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
class DatabaseService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const isDevelopmentMode = configService.get('NODE_ENV') === 'development';
    const isDBLoggingEnabled = configService.get('DB_LOGGING_ENABLED');
    super({
      log:
        isDevelopmentMode && isDBLoggingEnabled
          ? ['query', 'info', 'warn']
          : [],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async runTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(callback);
  }
}

export default DatabaseService;
