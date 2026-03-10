import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';

@Injectable()
export class BannerRepository {
    constructor(private readonly dbService: DatabaseService) { }

    async insert(data: Prisma.BannerUncheckedCreateInput, tx: Prisma.TransactionClient = this.dbService) {
        return await tx.banner.create({
            data,
        });
    }

    async update(id: string, data: Prisma.BannerUpdateInput, tx: Prisma.TransactionClient = this.dbService) {
        return await tx.banner.update({
            where: { id },
            data,
        });
    }

    async findOne(where: Prisma.BannerWhereInput) {
        return await this.dbService.banner.findFirst({
            where,
        });
    }

    async findMany(where: Prisma.BannerWhereInput, take?: number, skip?: number) {
        return await this.dbService.banner.findMany({
            where,
            take: take ? Number(take) : undefined,
            skip: skip ? Number(skip) : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }

    async delete(id: string) {
        return await this.dbService.banner.delete({
            where: { id },
        });
    }

    async count(where: Prisma.BannerWhereInput) {
        return await this.dbService.banner.count({
            where,
        });
    }
}
