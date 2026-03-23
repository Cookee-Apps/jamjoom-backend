import { Injectable, NotFoundException } from '@nestjs/common';
import { GiftRepository } from '../repositories/gift.repository';
import {
  CreateGiftDto,
  GetAllGiftsParamsDto,
  GetAllGiftsResponseDTO,
  UpdateGiftDto,
} from '../dto/gift.dto';

@Injectable()
export class GiftService {
  constructor(private readonly giftRepo: GiftRepository) {}

  async createGift(dto: CreateGiftDto) {
    const { perDayGiftLimit, remainingStock, storeId, active, imgEn, imgMl } =
      dto;

    const configData = {
      perDayGiftLimit: perDayGiftLimit ?? 0,
      remainingStock: remainingStock ?? 0,
    };

    return await this.giftRepo.createWithConfig(
      {
        storeId,
        nameEn: dto.nameEn,
        nameMl: dto.nameMl,
        imgEn: imgEn as string,
        imgMl: imgMl as string,
        tAndcEn: dto.tAndcEn,
        tAndcMl: dto.tAndcMl,
        active: active ?? true,
      },
      configData,
    );
  }

  async updateGift(dto: UpdateGiftDto) {
    const { id, perDayGiftLimit, remainingStock, imgEn, imgMl } = dto;
    const gift = await this.giftRepo.findOne({ id });
    if (!gift) throw new NotFoundException('Gift not found');

    const updateData: Record<string, unknown> = {};
    if (dto.nameEn !== undefined) updateData.nameEn = dto.nameEn;
    if (dto.nameMl !== undefined) updateData.nameMl = dto.nameMl;
    if (dto.tAndcEn !== undefined) updateData.tAndcEn = dto.tAndcEn;
    if (dto.tAndcMl !== undefined) updateData.tAndcMl = dto.tAndcMl;
    if (imgEn !== undefined) updateData.imgEn = imgEn;
    if (imgMl !== undefined) updateData.imgMl = imgMl;
    if (dto.active !== undefined) updateData.active = dto.active;

    const configData: Record<string, unknown> = {};
    if (perDayGiftLimit !== undefined)
      configData.perDayGiftLimit = perDayGiftLimit;
    if (remainingStock !== undefined)
      configData.remainingStock = remainingStock;

    return await this.giftRepo.updateWithConfig(id, updateData, configData);
  }

  async deleteGift(id: string) {
    const gift = await this.giftRepo.findOne({ id });
    if (!gift) throw new NotFoundException('Gift not found');
    return await this.giftRepo.delete(id);
  }

  async findAdminGifts(
    params: GetAllGiftsParamsDto,
  ): Promise<GetAllGiftsResponseDTO> {
    const where = params.storeId ? { storeId: params.storeId } : {};
    const [data, total] = await Promise.all([
      this.giftRepo.findMany(where, params.limit, params.skip),
      this.giftRepo.count(where),
    ]);
    return { data, total };
  }

  async findCustomerGifts(storeId: string, limit?: number, skip?: number) {
    return await this.giftRepo.findMany(
      {
        storeId,
        active: true,
      },
      limit,
      skip,
    );
  }

  async toggleGift(id: string) {
    const gift = await this.giftRepo.findOne({ id });
    if (!gift) throw new NotFoundException('Gift not found');
    return await this.giftRepo.update(id, { active: !gift.active });
  }
}
