// shared-cache.module.ts
import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheInterceptor } from './cache.interceptor';
import { InvalidateCacheInterceptor } from './cache.invalidate.interceptor';

@Global()
@Module({
  providers: [CacheService, CacheInterceptor, InvalidateCacheInterceptor],
  exports: [CacheService],
})
export class SharedCacheModule {}
