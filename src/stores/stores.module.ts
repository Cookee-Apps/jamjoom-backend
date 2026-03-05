import { Global, Module } from '@nestjs/common';
import { PasswordService } from 'utils/passwords.service';
import { StoreAdminController } from './controllers/store.admin.controller';
import { StoreController } from './controllers/store.controller';
import { StoreCustomerController } from './controllers/store.customer.controller';
import { StoreExistsValidator } from './decorators/check-valid-store';
import { StoreGuard } from './guard/store.guard';
import { StoreRepository } from './repositories/stores.repository';
import { StoreService } from './service/stores.service';
import { StoreValidator } from './validatiors/store.validators';

@Global()
@Module({
  controllers: [StoreAdminController, StoreCustomerController, StoreController],
  providers: [
    StoreRepository,
    StoreExistsValidator,
    PasswordService,
    StoreService,
    StoreGuard,
    StoreValidator,
  ],
  exports: [StoreService],
})
export class StoresModule { }
