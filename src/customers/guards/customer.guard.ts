import {
  BadRequestException,
  CanActivate,
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestWithUser } from 'src/auth/types/request_with_user';
import error_messages from '../constants/error_messages';
import { CustomerService } from '../services/customers.service';

@Injectable()
export class CustomerGuard implements CanActivate {
  constructor(
    private readonly customerService: CustomerService,
    @Inject(REQUEST) private readonly request: RequestWithUser,
  ) {}

  async canActivate(): Promise<boolean> {
    const userId = this.request.user.id;
    if (!userId) throw new InternalServerErrorException();
    const customer = await this.customerService.findCustomerByUserId(userId);
    if (!customer) throw new BadRequestException(error_messages.invalidCustomer);
    if (!customer.user.active)
      throw new BadRequestException(error_messages.blockedCustomer);
    this.request['customer'] = customer;
    return true
  }
}


