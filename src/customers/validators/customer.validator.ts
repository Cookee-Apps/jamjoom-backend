import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { UserService } from 'src/users/services/users.service';
import { CustomerRepository } from '../repositories/customers.repository';

@Injectable()
export class CustomerValidator {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly userService: UserService,
  ) {}

  async validateCustomerId(id: string) {
    if (!id && !isUUID(id)) throw new NotFoundException('Invalid id');
    const customer = await this.customerRepo.findOne({ id });
    if (!customer) throw new BadRequestException('Invalid customer id');
    return customer;
  }

  async validateCustomerUser(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new InternalServerErrorException();
    return user;
  }
}
