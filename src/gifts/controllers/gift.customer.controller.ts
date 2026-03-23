import { Controller, Get, Query, Req } from '@nestjs/common';
import { GiftService } from '../services/gift.service';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerCustomer } from 'utils/decorators/SwaggerDoc';
import { Request } from 'express';

@SwaggerCustomer('Gift')
@Controller('customer/gifts')
export class GiftCustomerController {
  constructor(private readonly giftService: GiftService) {}

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
    return await this.giftService.findCustomerGifts(storeId, limit, skip);
  }
}
