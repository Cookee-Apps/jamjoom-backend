import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Store } from '@prisma/client';
import { RequestWithUser } from 'src/auth/types/request_with_user';

class RequestWithStore extends RequestWithUser {
  store: Store;
}

export const CurrentStore = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithStore>();
    return request.store;
  },
);
