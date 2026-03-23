import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';

@Injectable()
export class GiftConfigRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findOne(where: Prisma.TrollyConfigWhereInput) {
    return await this.dbService.trollyConfig.findFirst({
      where,
      include: { gift: true },
    });
  }

  async update(giftId: string, data: Prisma.TrollyConfigUpdateInput) {
    return await this.dbService.trollyConfig.update({
      where: { giftId },
      data,
      include: { gift: true },
    });
  }

  async decrementStock(
    giftId: string,
    tx: Prisma.TransactionClient = this.dbService,
  ) {
    return await tx.trollyConfig.update({
      where: { giftId },
      data: {
        remainingStock: {
          decrement: 1,
        },
      },
    });
  }
}
