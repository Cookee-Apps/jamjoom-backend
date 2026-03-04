import { Global, Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleRepository } from './repositories/role.repository'

@Global()
@Module({
    exports: [RoleService],
    providers: [RoleService, RoleRepository]
})
export class RoleModule {}
