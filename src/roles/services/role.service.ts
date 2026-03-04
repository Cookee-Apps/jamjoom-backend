import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleNames } from '../constants/role.constants';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(private readonly roleRepo: RoleRepository) { }

  private roleNames: RoleNames[] = ['ADMIN', 'CUSTOMER', 'STORE_MANAGER'];

  checkRole = (roleName: string) => (role: string) => role === roleName;

  checkAdminRole = this.checkRole('ADMIN');
  checkCustomerRole = this.checkRole('CUSTOMER');
  checkStoreManagerRole = this.checkRole('STORE_MANAGER');

  async onModuleInit() {
    for (const roleName of this.roleNames) {
      const roleExists = await this.getRoleByName(roleName);
      if (!roleExists) {
        await this.roleRepo.insert({ name: roleName });
      }
    }
  }

  async getRoleByName(name: RoleNames) {
    const role = await this.roleRepo.findOne({ name });
    if (!role) {
      return await this.roleRepo.insert({ name });
    }
    return role;
  }

  async getRoleById(id: string) {
    return await this.roleRepo.findOne({ id })
  }
}
