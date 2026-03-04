import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { RoleNames } from 'src/roles/constants/role.constants';
import { RoleService } from 'src/roles/services/role.service';
import { Logger } from 'utils/logger/logger.service';
import { RequestWithUser } from '../types/request_with_user';

export const ROLE_KEY = 'roles';
export const Role = (roles: RoleNames[]) => SetMetadata(ROLE_KEY, roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly roleService: RoleService,
    private readonly logger: Logger,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const roleDetails = await this.roleService.getRoleById(request.user.roleId);
    if (!roleDetails) return false;
    const roles: RoleNames[] = this.reflector.getAllAndOverride<RoleNames[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    let allowed = false;
    if (roles && roles.length) {
      allowed = roles.includes(roleDetails.name as RoleNames);
      if (!allowed) this.logRoleAnomaly(roles.join(', '), roleDetails.name);
    }
    return allowed;
  }

  private logRoleAnomaly(roleName: string, userRole: string) {
    this.logger.error(
      `Role anomaly detected: Expected role '${roleName}', but got '${userRole}'`,
    );
  }
}
