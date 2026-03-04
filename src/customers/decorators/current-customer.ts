import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { RequestWithUser } from 'src/auth/types/request_with_user';

class RequestWithCustomer extends RequestWithUser {
  customer: Customer;
}

export const CurrentCustomer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithCustomer>();
    return request.customer;
  },
);
