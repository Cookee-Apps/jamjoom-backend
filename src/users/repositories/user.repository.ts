import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';
import { UserQueryBuilder } from '../query-builder/user.query-builder';

@Injectable()
export class UserRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly queryBuilder: UserQueryBuilder,
  ) { }

  async findOne(params: {
    phoneNumber?: string;
    roleId?: string;
    id?: string;
    username?: string;
    customerId?: string;
  }) {
    const where = this.queryBuilder.buildListWhereQuery(params);
    const entry = await this.dbService.users.findFirst({ where });
    return entry;
  }

  async update(id: string, data: Prisma.UsersUpdateInput) {
    const updated = await this.dbService.users.update({
      where: { id, deletedAt: null },
      data,
    });
    return updated;
  }

  async delete(id: string) {
    return await this.dbService.users.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async findMany(params: {
    roleId?: string;
  }) {
    const where = this.queryBuilder.buildListWhereQuery(params);
    const entries = await this.dbService.users.findMany({ where });
    return entries;
  }

  async insert(
    data: Prisma.UsersUncheckedCreateInput,
    db: Prisma.TransactionClient = this.dbService,
  ) {
    const createdUser = await db.users.create({ data });
    return createdUser;
  }
}
