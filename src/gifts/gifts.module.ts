import { Module } from '@nestjs/common';
import { GiftService } from './services/gift.service';
import { GiftRepository } from './repositories/gift.repository';
import { GiftAdminController } from './controllers/gift.admin.controller';
import { GiftCustomerController } from './controllers/gift.customer.controller';

@Module({
  controllers: [GiftAdminController, GiftCustomerController],
  providers: [GiftService, GiftRepository],
  exports: [GiftService],
})
export class GiftsModule {}
