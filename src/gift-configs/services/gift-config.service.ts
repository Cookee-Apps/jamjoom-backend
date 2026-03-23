import { Injectable, NotFoundException } from '@nestjs/common';
import { GiftConfigRepository } from '../repositories/gift-config.repository';
import {
  UpdateGiftConfigDto,
  GiftConfigResponseDto,
} from '../dto/gift-config.dto';

@Injectable()
export class GiftConfigService {
  constructor(private readonly giftConfigRepo: GiftConfigRepository) {}

  async updateGiftConfig(dto: UpdateGiftConfigDto) {
    const { giftId, perDayGiftLimit, remainingStock } = dto;

    const config = await this.giftConfigRepo.findOne({ giftId });
    if (!config) throw new NotFoundException('Gift config not found');

    const updateData: Record<string, unknown> = {};
    if (perDayGiftLimit !== undefined)
      updateData.perDayGiftLimit = perDayGiftLimit;
    if (remainingStock !== undefined)
      updateData.remainingStock = remainingStock;

    return await this.giftConfigRepo.update(giftId, updateData);
  }

  async getGiftConfig(giftId: string): Promise<GiftConfigResponseDto> {
    const config = await this.giftConfigRepo.findOne({ giftId });
    if (!config) throw new NotFoundException('Gift config not found');
    return config;
  }

  async decrementStock(giftId: string) {
    const config = await this.giftConfigRepo.findOne({ giftId });
    if (!config) throw new NotFoundException('Gift config not found');
    if (config.remainingStock <= 0) {
      throw new NotFoundException('No stock remaining');
    }
    return await this.giftConfigRepo.decrementStock(giftId);
  }
}
