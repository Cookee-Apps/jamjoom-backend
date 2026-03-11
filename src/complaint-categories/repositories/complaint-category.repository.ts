import { Injectable } from '@nestjs/common';
import DatabaseService from 'utils/db/db.service';
import { CreateComplaintCategoryDto, UpdateComplaintCategoryDto } from '../dto/complaint-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComplaintCategoryRepository {
    constructor(private readonly db: DatabaseService) { }

    async create(data: Prisma.ComplaintCategoryCreateInput) {
        return this.db.complaintCategory.create({ data });
    }

    async update(id: string, data: Prisma.ComplaintCategoryUpdateInput) {
        return this.db.complaintCategory.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.db.complaintCategory.delete({ where: { id } });
    }

    async findById(id: string) {
        return this.db.complaintCategory.findUnique({ where: { id } });
    }

    async findAll(params: { skip?: number; take?: number; active?: boolean }) {
        const { skip, take, active } = params;
        const where = active !== undefined ? { active } : {};

        const [data, total] = await Promise.all([
            this.db.complaintCategory.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.db.complaintCategory.count({ where }),
        ]);

        return { data, total };
    }

    async toggleActive(id: string) {
        const category = await this.findById(id);
        if (!category) return null;

        return this.db.complaintCategory.update({
            where: { id },
            data: { active: !category.active },
        });
    }
}
