import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ListCustomersParamsDTO } from '../dto/customers.dto';

@Injectable()
export class CustomersQueryBuilder {
  constructor() {}

  listWhereQuery(params: ListCustomersParamsDTO): Prisma.CustomerWhereInput {
    const where: Prisma.CustomerWhereInput = {};
    if (params.active !== undefined) where.user = { active: params.active }
    if (params.searchText) {
      where.OR = [
        { user: { phoneNumber: { contains: params.searchText } } },
        {
          user: {
            OR: [
              { firstName: { contains: params.searchText } },
              { lastName: { contains: params.searchText } },
            ],
          },
        },
      ];
    }
    return where;
  }

  sortQuery(params: ListCustomersParamsDTO) {
    let orderSortQuery: Prisma.CustomerOrderByWithRelationInput = {
      refNo: 'desc',
    };
    return orderSortQuery;
  }

  includeQuery(): Prisma.CustomerInclude {
    return {
      user: {
        select: {
          phoneNumber: true,
          firstName: true,
          active: true,
          lastName: true,
        },
      }
    };
  }
}
