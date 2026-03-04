import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CacheService } from 'utils/cache/cache.service';
import DatabaseService from 'utils/db/db.service';

@Injectable()
export class StoreRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  async insert(
    data: Prisma.StoreCreateInput,
    tx: Prisma.TransactionClient = this.dbService,
  ) {
    const store = await tx.store.create({
      data,
    });
    this.cacheService.set(`store-${store.id}`, store);
    return store;
  }

  async update(
    id: string,
    data: Prisma.StoreUpdateInput,
    tx: Prisma.TransactionClient = this.dbService,
  ) {
    const updatedStore = await tx.store.update({
      where: { id, deletedAt: null },
      data,
    });
    this.cacheService.set(`store-${updatedStore.id}`, updatedStore);
    return updatedStore;
  }

  async findOne(where: Prisma.StoreWhereInput) {
    return await this.dbService.store.findFirst({
      where: { ...where, deletedAt: null },
      include: { user: true },
    });
  }

  async find(where: Prisma.StoreWhereInput) {
    return await this.dbService.store.findMany({
      where: { ...where, deletedAt: null },
    });
  }

  async delete(id: string) {
    this.cacheService.del(`store-${id}`);
    return await this.dbService.store.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async count(where: Prisma.StoreWhereInput) {
    return await this.dbService.store.count({
      where: { ...where, deletedAt: null },
    });
  }

  async runParameterizedQuery<T = unknown>(query: Prisma.Sql): Promise<T[]> {
    return this.dbService.$queryRaw<T[]>(query);
  }
}
