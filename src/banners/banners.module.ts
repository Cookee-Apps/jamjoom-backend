import { Module } from '@nestjs/common';
import { BannerService } from './services/banner.service';
import { BannerRepository } from './repositories/banner.repository';
import { BannerAdminController } from './controllers/banner.admin.controller';
import { BannerCustomerController } from './controllers/banner.customer.controller';

@Module({
    controllers: [BannerAdminController, BannerCustomerController],
    providers: [BannerService, BannerRepository],
    exports: [BannerService],
})
export class BannersModule { }
