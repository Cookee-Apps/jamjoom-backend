import { Module } from '@nestjs/common';
import { ConfigurationAdminController } from './controllers/configuration.admin.controller';
import { ConfigurationService } from './services/configuration.service';
import { ConfigurationRepository } from './repositories/configuration.repository';
import { ConfigurationCustomerController } from './controllers/configuration.customer.controller';
import { ConfigurationStoreController } from './controllers/configuration.store.controller';

@Module({
  controllers: [
    ConfigurationAdminController,
    ConfigurationStoreController,
    ConfigurationCustomerController,
  ],
  providers: [ConfigurationService, ConfigurationRepository],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
