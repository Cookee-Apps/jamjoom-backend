import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';

@Injectable()
export class GiftRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async insert(
    data: Prisma.TrollyGiftUncheckedCreateInput,
    tx: Prisma.TransactionClient = this.dbService,
  ) {
    return await tx.trollyGift.create({
      data,
      include: { config: true },
    });
  }

  async update(
    id: string,
    data: Prisma.TrollyGiftUpdateInput,
    tx: Prisma.TransactionClient = this.dbService,
  ) {
    return await tx.trollyGift.update({
      where: { id },
      data,
      include: { config: true },
    });
  }

  async findOne(where: Prisma.TrollyGiftWhereInput) {
    return await this.dbService.trollyGift.findFirst({
      where,
      include: { config: true },
    });
  }

  async findMany(
    where: Prisma.TrollyGiftWhereInput,
    take?: number,
    skip?: number,
  ) {
    return await this.dbService.trollyGift.findMany({
      where,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
      orderBy: { id: 'desc' },
      include: { config: true },
    });
  }

  async delete(id: string) {
    return await this.dbService.trollyGift.delete({
      where: { id },
    });
  }

  async count(where: Prisma.TrollyGiftWhereInput) {
    return await this.dbService.trollyGift.count({
      where,
    });
  }

  async createWithConfig(
    giftData: Prisma.TrollyGiftUncheckedCreateInput,
    configData: { perDayGiftLimit: number; remainingStock: number },
    tx: Prisma.TransactionClient = this.dbService,
  ) {
    return await tx.trollyGift.create({
      data: {
        ...giftData,
        config: {
          create: configData,
        },
      },
      include: { config: true },
    });
  }

  async updateWithConfig(
    giftId: string,
    giftData: Prisma.TrollyGiftUpdateInput,
    configData: Prisma.TrollyConfigUpdateInput,
    tx: Prisma.TransactionClient = this.dbService,
  ) {
    return await tx.trollyGift.update({
      where: { id: giftId },
      data: {
        ...giftData,
        config: {
          update: configData,
        },
      },
      include: { config: true },
    });
  }
}
