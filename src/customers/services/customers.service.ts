import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoleNamesObj } from 'src/roles/constants/role.constants';
import { RoleService } from 'src/roles/services/role.service';
import { UserService } from 'src/users/services/users.service';
import { generateReferralCode } from 'utils/string.helper';
import { CustomerRepository } from '../repositories/customers.repository';
import { ListCustomersParamsDTO } from '../dto/customers.dto';
import { CustomersQueryBuilder } from '../query-builder/customers.query.builder';
import { ConfigurationService } from 'src/configuration/services/configuration.service';
import { ConfigKey } from 'src/configuration/interfaces/configuration.dto.interface';
import { CustomerValidator } from '../validators/customer.validator';
import DateHelpers from 'utils/date.helper';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly queryBuilder: CustomersQueryBuilder,
    private readonly configurationService: ConfigurationService,
    private readonly validator: CustomerValidator,
  ) { }

  async findCustomerByUserId(userId: string) {
    return await this.customerRepo.findOne({ userId });
  }

  async detail(id: string) {
    return await this.customerRepo.findOne({ id });
  }

  async toggle(customerId: string) {
    const customer = await this.validator.validateCustomerId(customerId);
    const user = await this.validator.validateCustomerUser(customer.userId);
    await this.customerRepo.update(customer.id, {
      user: { update: { active: !user.active } },
    });
    return { updated: true };
  }

  async topCustomers(
    limit: number,
    storeId?: string,
    fromDate?: Date,
    toDate?: Date,
  ) {
    // Base where input for Customer
    const where: Prisma.CustomerWhereInput = {};

    // Build dynamic Order where input
    let orderWhere = {}

    if (storeId) orderWhere = { storeId };

    if (fromDate && toDate) {
      const dateFilter = {
        createdAt: {
          gte: DateHelpers.startOfDay(fromDate),
          lte: DateHelpers.endOfDay(toDate),
        },
      };
      orderWhere = orderWhere ? { ...orderWhere, ...dateFilter } : dateFilter;
    }

    // if (orderWhere) {
    //   where.orders = { some: { ...orderWhere, status: { not: 'cancelled' } } };
    // }

    // Fetch customers with order count and optional order totals
    const customers = await this.customerRepo.find(
      where,
      Number.MAX_SAFE_INTEGER,
      0,
      {
        // _count: { select: { orders: true } },
        // orders: { select: { totalAmount: true } },
        user: true,
      },
    );

    // Sort customers descending by order count
    // customers.sort((a, b) => b._count.orders - a._count.orders);

    // Return top N
    return customers.slice(0, limit);
  }

  async list(params: ListCustomersParamsDTO) {
    if (params.topCustomers)
      return await this.topCustomers(
        params.limit,
        params.storeId,
      );
    const where = this.queryBuilder.listWhereQuery(params);
    return {
      data: await this.customerRepo.find(
        where,
        params.limit,
        params.skip,
        this.queryBuilder.includeQuery(),
        this.queryBuilder.sortQuery(params),
      ),
      totalCount: await this.customerRepo.count(where),
    };
  }

  async createCustomer(
    userId: string,
    refereeCode?: string,
    db?: Prisma.TransactionClient,
  ) {
    const referralCode = generateReferralCode();
    let referrerId: string | undefined;
    if (refereeCode) {
      const referrer = await this.findCustomerByReferralCode(refereeCode);
      referrerId = referrer?.id;
    }

    const data: Prisma.CustomerCreateInput = {
      referralCode,
      user: { connect: { id: userId } },
    };

    if (referrerId) {
      data.referredByUser = { connect: { id: referrerId } };
    }
    const customer = await this.customerRepo.insert(data, db);
    if (referrerId) {
      const referralBonus =
        await this.configurationService.getConfigurationByKey(
          ConfigKey.referralBonus,
        );
      const refereeBonus =
        await this.configurationService.getConfigurationByKey(
          ConfigKey.refereeBonus,
        );
    }

    return customer;
  }

  async findCustomerByPhoneNumber(phoneNumber: string) {
    return await this.customerRepo.findOne({ user: { phoneNumber, deletedAt: null } });
  }

  // used for onboarding a customer
  // if a manual order entry happens
  async checkCustomerExistsForOrder(
    phoneNumber: string,
    name: string,
    lastName: string,
    tx?: Prisma.TransactionClient,
  ): Promise<[string, string | null]> {
    let customer = await this.findCustomerByPhoneNumber(phoneNumber);
    if (customer) return [customer.id, customer.user.username];
    const role = await this.roleService.getRoleByName(RoleNamesObj.CUSTOMER);
    if (!role) throw new InternalServerErrorException();
    const account = await this.userService.createAccount(
      role?.id,
      phoneNumber,
      phoneNumber, // username is phoneNumber for now
      undefined,
      tx,
      name,
      lastName,
    );
    customer = await this.createCustomer(account.id, undefined, tx);
    return [customer.id, account.username];
  }

  async findCustomerByReferralCode(referralCode: string) {
    return await this.customerRepo.findOne({ referralCode });
  }

  async findCustomer(id: string) {
    return await this.customerRepo.findOne({ id });
  }

  async checkReferralCode(referralCode: string) {
    const customer = await this.findCustomerByReferralCode(referralCode);
    if (!customer) {
      throw new BadRequestException('Invalid referral code');
    }
  }
}
