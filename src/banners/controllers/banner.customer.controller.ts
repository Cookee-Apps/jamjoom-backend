import { Controller, Get, Query, Req } from '@nestjs/common';
import { BannerService } from '../services/banner.service';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerCustomer } from 'utils/decorators/SwaggerDoc';
import { Request } from 'express';

@SwaggerCustomer('Banner')
@Controller('customer/banners')
export class BannerCustomerController {
    constructor(private readonly bannerService: BannerService) { }

    @ProtectRoute(['CUSTOMER'])
    @Get('list')
    async list(
        @Req() req: Request,
        @Query('limit') limit?: number,
        @Query('skip') skip?: number,
    ) {
        const user = req['user'];
        const storeId = user.currentStoreId;
        if (!storeId) return [];
        return await this.bannerService.findCustomerBanners(storeId, limit, skip);
    }
}
