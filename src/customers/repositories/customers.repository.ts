import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CacheService } from 'utils/cache/cache.service';
import DateHelpers from 'utils/date.helper';
import DatabaseService from 'utils/db/db.service';

type CustomerWithUser = Prisma.CustomerGetPayload<{
  include: { user: true };
}>;

@Injectable()
export class CustomerRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  async getCustomerOrderFrequency(
    storeId?: string,
    fromDate?: Date,
    toDate?: Date,
    upperLimit = 10,
  ) {
    // Build WHERE clause dynamically
    const filters: Prisma.Sql[] = [Prisma.sql`"status" != 'PAYMENT_PENDING'`];
    if (fromDate) fromDate = DateHelpers.startOfDay(fromDate);
    if (toDate) toDate = DateHelpers.endOfDay(toDate);
    if (storeId) {
      filters.push(Prisma.sql`"storeId" = ${storeId}`);
    }

    if (fromDate && toDate) {
      filters.push(Prisma.sql`"createdAt" BETWEEN ${fromDate} AND ${toDate}`);
    } else if (fromDate) {
      filters.push(Prisma.sql`"createdAt" >= ${fromDate}`);
    } else if (toDate) {
      filters.push(Prisma.sql`"createdAt" <= ${toDate}`);
    }

    // Join filters with AND if any exist
    const whereClause =
      filters.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(filters, ' AND ')}`
        : Prisma.sql``;

    const result = await this.dbService.$queryRaw<
      { order_count_group: number; customer_count: number }[]
    >(Prisma.sql`
  WITH customer_orders AS (
    SELECT 
      "customerId",
      COUNT(*) AS order_count
    FROM "Order"
    ${whereClause}
    GROUP BY "customerId"
  ),
  grouped AS (
    SELECT
      LEAST(order_count, ${upperLimit}) AS order_count_group,
      COUNT(*) AS customer_count
    FROM customer_orders
    GROUP BY order_count_group
  ),
  cumulative AS (
    SELECT 
      g1.order_count_group,
      SUM(g2.customer_count) AS customer_count
    FROM grouped g1
    JOIN grouped g2 ON g2.order_count_group >= g1.order_count_group
    GROUP BY g1.order_count_group
  )
  SELECT * FROM cumulative ORDER BY order_count_group;
`);

    return result.map((r) => ({
      orders: Number(r.order_count_group),
      customers: Number(r.customer_count),
    }));
  }

  async insert(
    data: Prisma.CustomerCreateInput,
    tx: Prisma.TransactionClient = this.dbService,
  ) {
    const created = await tx.customer.create({
      data,
      include: { user: true },
    });
    this.setCustomerInCache(created);
    return created;
  }

  async update(id: string, data: Prisma.CustomerUpdateInput) {
    const updated = await this.dbService.customer.update({
      where: { id },
      data,
      include: { user: true },
    });
    this.setCustomerInCache(updated);
    return updated;
  }

  private setCustomerInCache(customer: CustomerWithUser) {
    this.cacheService.set(`customer-user-${customer.userId}`, customer);
    return this.cacheService.set(`customer-${customer.id}`, customer);
  }

  async findOne(
    where: Prisma.CustomerWhereInput,
  ): Promise<CustomerWithUser | null> {
    const customer = await this.dbService.customer.findFirst({
      where,
      include: {
        user: true,
        referredByUser: { include: { user: true } },
      },
    });
    if (customer) this.setCustomerInCache(customer);
    return customer;
  }

  async find(
    where: Prisma.CustomerWhereInput,
    limit: number,
    skip: number,
    include: Prisma.CustomerInclude = {},
    orderBy: Prisma.CustomerOrderByWithRelationInput = {},
  ) {
    return await this.dbService.customer.findMany({
      where,
      orderBy,
      take: limit,
      skip,
      include,
    });
  }

  async delete(id: string) {
    this.cacheService.del(`customer-${id}`);
    return await this.dbService.customer.delete({ where: { id } });
  }

  async count(where: Prisma.CustomerWhereInput) {
    return await this.dbService.customer.count({ where });
  }
}
