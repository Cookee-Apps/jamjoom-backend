import { Global, Module } from '@nestjs/common';
import { CustomerGuard } from './guards/customer.guard';
import { CustomerRepository } from './repositories/customers.repository';
import { CustomerService } from './services/customers.service';
import { CustomersQueryBuilder } from './query-builder/customers.query.builder';
import { AdminCustomerController } from './controllers/customers.controller';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { StoreCustomerController } from './controllers/customer.store.controller';
import { CustomerValidator } from './validators/customer.validator';

@Global()
@Module({
  imports: [ConfigurationModule],
  controllers: [AdminCustomerController, StoreCustomerController],
  providers: [
    CustomerService,
    CustomersQueryBuilder,
    CustomerValidator,
    CustomerGuard,
    CustomerRepository,
  ],
  exports: [CustomerService],
})
export class CustomersModule {}
