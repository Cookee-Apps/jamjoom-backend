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

  private async createAdmin(email: string, password: string) {
    const existing = await this.findOneByEmail(email);
    const hashedPassword = await this.passwordService.hashPassword(password);
    if (existing) {
      return await this.userRepo.update(existing.id, {
        password: hashedPassword,
      });
    }
    const adminRole = (await this.roleService.getRoleByName('ADMIN')) as Role;
    return await this.userRepo.insert({
      email,
      roleId: adminRole.id,
      password: hashedPassword,
    });
  }

  async onModuleInit() {
    const emails = ['admin1', 'admin2', 'admin3', 'admin4', 'admin5'];
    for (const email of emails) {
      await this.createAdmin(`${email}@spinners.com`, this.ADMIN_ACCOUNT_PASSWORD);
    }
    for (const email of ['marketing-team', 'marketing-team-1']) {
      await this.createAdmin(`${email}@spinners.com`, 'spinnersmarketing');
    }
  }

  async findOneByEmail(email: string, roleName?: string) {
    let roleId: string | undefined;
    if (roleName) {
      const roleDetails = await this.roleService.getRoleByName(
        roleName as RoleNames,
      );
      if (!roleDetails) throw new InternalServerErrorException();
      roleId = roleDetails.id;
    }
    return await this.userRepo.findOne({ email });
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

  async findById(id: string) {
    return await this.userRepo.findOne({ id });
  }

  async findUserOfCustomer(customerId: string) {
    return await this.userRepo.findOne({ customerId });
  }

  async updateAccount(
    id: string,
    updateData: Partial<{
      email: string;
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
    email?: string,
    password?: string,
    db?: Prisma.TransactionClient,
    firstName?: string,
    lastName?: string,
  ) {
    const createInput: Prisma.UsersUncheckedCreateInput = {
      email,
      phoneNumber,
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
