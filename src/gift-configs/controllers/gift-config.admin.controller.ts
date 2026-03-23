import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GiftConfigService } from '../services/gift-config.service';
import {
  UpdateGiftConfigDto,
  GiftConfigResponseDto,
} from '../dto/gift-config.dto';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';

@SwaggerAdmin('GiftConfig')
@Controller('admin/gift-configs')
export class GiftConfigAdminController {
  constructor(private readonly giftConfigService: GiftConfigService) {}

  @ProtectRoute(['ADMIN'])
  @Post('/update')
  async update(@Body() dto: UpdateGiftConfigDto) {
    return await this.giftConfigService.updateGiftConfig(dto);
  }

  @ProtectRoute(['ADMIN'])
  @Get(':giftId')
  async get(@Param('giftId') giftId: string): Promise<GiftConfigResponseDto> {
    return await this.giftConfigService.getGiftConfig(giftId);
  }
}
