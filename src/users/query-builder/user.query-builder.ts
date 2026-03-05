import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserQueryBuilder {
  buildListWhereQuery(params: {
    phoneNumber?: string;
    roleId?: string;
    id?: string;
    username?: string;
    customerId?: string;
  }): Prisma.UsersWhereInput {
    const where: Prisma.UsersWhereInput = { deletedAt: null };
    if (params.id) where.id = params.id;
    if (params.roleId) where.roleId = params.roleId;
    if (params.phoneNumber) where.phoneNumber = params.phoneNumber;
    if (params.username) where.username = params.username;
    if (params.customerId) where.customer = { id: params.customerId };
    return where;
  }
}
