import { Global, Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UserRepository } from './repositories/user.repository';
import { PasswordService } from 'utils/passwords.service';
import { UserQueryBuilder } from './query-builder/user.query-builder';

@Global()
@Module({
  exports: [UserService],
  providers: [UserService, UserQueryBuilder, UserRepository, PasswordService],
})
export class UsersModule {}
