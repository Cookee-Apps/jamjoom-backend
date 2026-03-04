import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { SessionService } from 'src/session/services/session.service';
import { UserService } from 'src/users/services/users.service';
import { AuthService } from '../services/auth.service';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CustomerGuard } from 'src/customers/guards/customer.guard';
import { StoreGuard } from 'src/stores/guard/store.guard';
import { Logger } from 'utils/logger/logger.service';
import { RequestWithUser } from '../types/request_with_user';
import { Role, RoleGuard } from './role.guard';
import { RoleNames } from 'src/roles/constants/role.constants';

@Injectable()
class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const tokenFromHeader = request.headers.authorization;
    if (!tokenFromHeader) throw new UnauthorizedException();

    const token = this.authService.getToken(tokenFromHeader);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.authService.getJWTPayload(token);
      const validSession = await this.sessionService.findOne(payload.sessionId);
      if (!validSession) throw new UnauthorizedException();

      const userDetails = await this.userService.findById(validSession.userId);
      if (!userDetails) throw new UnauthorizedException();

      request.user = userDetails;
      request.session = validSession
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException();
    }
    return true;
  }
}

/** default rolesNames will be ['ADMIN'] */
export function ProtectRoute(roleNames: RoleNames[] = ['ADMIN']) {
  const guards: Type<CanActivate>[] = [];
  let decorators: ClassDecorator & MethodDecorator =
    ApiBearerAuth('AdminToken');
  for (const eachRole of roleNames) {
    if (eachRole === 'CUSTOMER') {
      guards.push(CustomerGuard);
      decorators = ApiBearerAuth('CustomerToken');
    }
    if (eachRole === 'STORE_MANAGER') {
      guards.push(StoreGuard);
      decorators = ApiBearerAuth('StoreToken');
    }
  }
  return applyDecorators(
    UseGuards(AuthGuard, ...guards, RoleGuard),
    decorators,
    Role(roleNames)
  );
}
