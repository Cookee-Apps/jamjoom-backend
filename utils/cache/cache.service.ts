// cache.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Command } from 'ioredis';
import { Logger } from 'utils/logger/logger.service';

@Injectable()
export class CacheService implements OnModuleDestroy, OnModuleInit {
  private redis: Redis;
  private enabled = false;
  async onModuleInit() {
    await this.initRedis();
  }

  async initRedis() {
    if (this.redis) return this.redis;
    this.enabled = this.configService.get<boolean>(
      'CACHING_ENABLED',
    ) as boolean;
    if (this.enabled) {
      this.redis = new Redis({
        host: process.env.REDIS_HOST as string,
        port: Number(process.env.REDIS_PORT) as number,
        maxRetriesPerRequest: 5,
        connectTimeout: 5000,
        retryStrategy(times) {
          if (times >= 5) return null;
          return 1000;
        },
      });
      this.redis.on('connecting', () => this.logger.log('Connecting to Redis'));
      this.redis.on('connect', () => this.logger.log('Redis connected'));
      this.redis.on('error', () => this.logger.error('Redis error'));
      this.redis.on('close', () => (this.enabled = false));
    }
  }

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  private CACHE_PREFIX = process.env.CACHE_PREFIX || 'app_cache';

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled) return null;
    key = `${this.CACHE_PREFIX}-${key}`;
    const value = await this.redis.get(key);
    let found = null;
    try {
      found = JSON.parse(value as string);
    } catch {
      found = value as any;
    }
    return found;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.enabled) return;
    key = `${this.CACHE_PREFIX}-${key}`;
    try {
      const val = typeof value === 'string' ? value : JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.set(key, val, 'EX', ttlSeconds);
      } else {
        await this.redis.set(key, val);
      }
    } catch {}
  }

  async del(key: string): Promise<void> {
    if (!this.enabled) return;
    
    await this.redis.del(key);
  }

  async deleteByPrefix(prefix: string){
    return await this.deleteByMatch(`${this.CACHE_PREFIX}-${prefix}*`)
  }

  private async deleteByMatch(match: string): Promise<void> {
    if (!this.enabled) return;

    const stream = this.redis.scanStream({
      match,
      count: 100,
    });

    const pendingDeletes: Promise<any>[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          // Queue the delete operation
          pendingDeletes.push(this.redis.del(...keys));
        }
      });

      stream.on('end', async () => {
        try {
          await Promise.all(pendingDeletes); // Ensure all deletions complete
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      stream.on('error', reject);
    });
  }

  async runCommand(command: Command) {
    if (!this.enabled) return null;
    await this.redis.sendCommand(command);
    this.logger.log(`Redis Command Ran: ${command.name}`);
  }

  async onModuleDestroy() {
    if (this.enabled) await this.redis.quit();
  }
}
