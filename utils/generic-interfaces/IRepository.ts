import { Prisma } from '@prisma/client';

export interface IRepository {
  runRawQuery(query: Prisma.Sql, tx: Prisma.TransactionClient): Promise<any>;
}
