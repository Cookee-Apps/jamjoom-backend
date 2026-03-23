import { Module } from '@nestjs/common';
import { GiftConfigService } from './services/gift-config.service';
import { GiftConfigRepository } from './repositories/gift-config.repository';
import { GiftConfigAdminController } from './controllers/gift-config.admin.controller';

@Module({
  controllers: [GiftConfigAdminController],
  providers: [GiftConfigService, GiftConfigRepository],
  exports: [GiftConfigService],
})
export class GiftConfigsModule {}
