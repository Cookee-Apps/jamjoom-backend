import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';

@Injectable()
export class ComplaintRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(data: Prisma.ComplaintCreateInput) {
    return this.db.complaint.create({ data });
  }

  async update(id: string, data: Prisma.ComplaintUpdateInput, db: Prisma.TransactionClient = this.db) {
    return db.complaint.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.db.complaintPhoto.deleteMany({ where: { complaintId: id } });
    return this.db.complaint.delete({ where: { id } });
  }

  async findById(id: string, db: Prisma.TransactionClient = this.db) {
    return db.complaint.findUnique({
      where: { id },
      include: { category: true, photos: true },
    });
  }

  async findAll(params: { skip?: number; take?: number; userId?: string }) {
    const where: Prisma.ComplaintWhereInput = {};
    if (params.userId) where.userId = params.userId;

    const [data, total] = await Promise.all([
      this.db.complaint.findMany({
        where,
        include: { category: true, photos: true },
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.complaint.count({ where }),
    ]);

    return { data, total };
  }
}
