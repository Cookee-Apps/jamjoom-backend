import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { RoleService } from 'src/roles/services/role.service';
import { PasswordService } from 'utils/passwords.service';
import { UserRepository } from '../repositories/user.repository';
import { RoleNames } from 'src/roles/constants/role.constants';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleService: RoleService,
    private readonly passwordService: PasswordService,
  ) { }

  private ADMIN_ACCOUNT_PASSWORD = 'admin123';

  private async createAdmin(username: string, password: string) {
    const existing = await this.findOneByUsername(username);
    const hashedPassword = await this.passwordService.hashPassword(password);
    if (existing) {
      return await this.userRepo.update(existing.id, {
        password: hashedPassword,
      });
    }
    const adminRole = (await this.roleService.getRoleByName('ADMIN')) as Role;
    return await this.userRepo.insert({
      username,
      roleId: adminRole.id,
      password: hashedPassword,
    });
  }

  async onModuleInit() {
    const usernames = ['admin1', 'admin2', 'admin3', 'admin4', 'admin5'];
    for (const username of usernames) {
      await this.createAdmin(username, this.ADMIN_ACCOUNT_PASSWORD);
    }
    for (const username of ['marketing-team', 'marketing-team-1']) {
      await this.createAdmin(username, 'spinnersmarketing');
    }
  }

  async findOneByPhoneNumber(phoneNumber: string, roleName?: string) {
    let roleId: string | undefined;
    if (roleName) {
      const roleDetails = await this.roleService.getRoleByName(
        roleName as RoleNames,
      );
      if (!roleDetails) throw new InternalServerErrorException();
      roleId = roleDetails.id;
    }
    return await this.userRepo.findOne({ phoneNumber, roleId });
  }

  async findOneByUsername(username: string) {
    return await this.userRepo.findOne({ username });
  }

  async findById(id: string) {
    return await this.userRepo.findOne({ id });
  }

  async findUserOfCustomer(customerId: string) {
    return await this.userRepo.findOne({ customerId });
  }

  async updateAccount(
    id: string,
    updateData: Partial<{
      username: string;
      name: string;
      password: string;
      lastLoginAt: Date;
      firstName: string;
      lastName: string;
    }>,
  ) {
    return await this.userRepo.update(id, updateData);
  }

  async createAccount(
    roleId: string,
    phoneNumber?: string,
    username?: string,
    password?: string,
    db?: Prisma.TransactionClient,
    firstName?: string,
    lastName?: string,
  ) {
    const createInput: Prisma.UsersUncheckedCreateInput = {
      phoneNumber,
      username: username || phoneNumber || '', // Ensure username is provided as it's now mandatory
      firstName,
      lastName,
      roleId,
    };
    if (password)
      createInput.password = await this.passwordService.hashPassword(password);
    return await this.userRepo.insert(createInput, db);
  }

  async findByRole(roleName: RoleNames) {
    const roleDetails = await this.roleService.getRoleByName(roleName);
    if (!roleDetails) throw new InternalServerErrorException();
    return await this.userRepo.findMany({ roleId: roleDetails.id });
  }

  async deleteAccount(id: string) {
    return await this.userRepo.delete(id)
  }
}
