import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { CacheService } from 'utils/cache/cache.service';
import DatabaseService from 'utils/db/db.service';

@Injectable()
export class RoleRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  async insert(data: Prisma.RoleCreateInput) {
    const insertedRole = await this.dbService.role.create({ data });
    this.cacheService.set(`role-${insertedRole.id}`, insertedRole);
    return insertedRole;
  }

  async findOne(where: Prisma.RoleWhereInput) {
    if (where.id || where.name) {
      let cacheEntry: Role | null = null;
      if (where.id) {
        cacheEntry = await this.cacheService.get(`role-${where.id}`) as Role
      } else if (where.name) {
        cacheEntry = await this.cacheService.get(`role-name-${where.name}`) as Role
      }
      if (cacheEntry) return cacheEntry as Role;
    }
    const role = await this.dbService.role.findFirst({
      where,
    });
    if (role) {
      this.cacheService.set(`role-${role.id}`, role);
      this.cacheService.set(`role-name-${role.name}`, role);
    }
    return role;
  }
}
