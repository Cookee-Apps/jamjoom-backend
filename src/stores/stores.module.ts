import { Global, Module } from '@nestjs/common';
import { StoreRepository } from './repositories/stores.repository';
import { StoreService } from './service/stores.service';
import { StoreExistsValidator } from './decorators/check-valid-store';
import { StoreAdminController } from './controllers/store.admin.controller';
import { StoreCustomerController } from './controllers/store.customer.controller';
import { StoreGuard } from './guard/store.guard';
import { StoreValidator } from './validatiors/store.validators';
import { StoreController } from './controllers/store.controller';

@Global()
@Module({
  controllers: [StoreAdminController, StoreCustomerController, StoreController],
  providers: [
    StoreRepository,
    StoreExistsValidator,
    StoreService,
    StoreGuard,
    StoreValidator,
  ],
  exports: [StoreService],
})
export class StoresModule {}
