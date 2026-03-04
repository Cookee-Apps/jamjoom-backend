import { Injectable } from '@nestjs/common';
import DatabaseService from 'utils/db/db.service';
import { Configuration, Prisma } from '@prisma/client';
import { CacheService } from 'utils/cache/cache.service';
import { safePromiseCall } from 'utils/promise.helper';

@Injectable()
export class ConfigurationRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  async insert(data: Prisma.ConfigurationCreateInput) {
    safePromiseCall(this.cacheService.set(`config-${data.key}`, data));
    return await this.dbService.configuration.create({ data });
  }

  async find(where?: Prisma.ConfigurationWhereInput) {
    return await this.dbService.configuration.findMany({ where });
  }

  async findOne(where: Prisma.ConfigurationWhereInput) {
    if (where.key) {
      const cacheEntry: Configuration | null = await this.cacheService.get(
        `config-${where.key as string}`,
      );
      if (cacheEntry) return cacheEntry;
    }
    const data = await this.dbService.configuration.findFirst({
      where,
    });
    if (data) safePromiseCall(this.cacheService.set(`config-${data.key}`, data));

    return data;
  }

  async update(key: string, value: string) {
    const updated = await this.dbService.configuration.update({
      where: {
        key: key,
      },
      data: {
        value,
      },
    });
    safePromiseCall(this.cacheService.set(`config-${key}`, updated));
    return updated;
  }
}
