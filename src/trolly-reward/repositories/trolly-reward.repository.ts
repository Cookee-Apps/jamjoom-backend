import { Injectable } from '@nestjs/common';
import DatabaseService from 'utils/db/db.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TrollyRewardRepository {
    constructor(private readonly db: DatabaseService) { }

    async create(data: Prisma.TrollyRewardCreateInput) {
        return this.db.trollyReward.create({ data });
    }

    async update(id: string, data: Prisma.TrollyRewardUpdateInput) {
        return this.db.trollyReward.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.db.trollyReward.delete({ where: { id } });
    }

    async findById(id: string) {
        return this.db.trollyReward.findUnique({ where: { id } });
    }

    async findAll(params: { skip?: number; take?: number; active?: boolean; storeId?: string }) {
        const { skip, take, active, storeId } = params;
        const where: Prisma.TrollyRewardWhereInput = {};

        if (active !== undefined) where.active = active;
        if (storeId !== undefined) where.storeId = storeId;

        const [data, total] = await Promise.all([
            this.db.trollyReward.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.db.trollyReward.count({ where }),
        ]);

        return { data, total };
    }

    async toggleActive(id: string) {
        const reward = await this.findById(id);
        if (!reward) return null;

        return this.db.trollyReward.update({
            where: { id },
            data: { active: !reward.active },
        });
    }
}
