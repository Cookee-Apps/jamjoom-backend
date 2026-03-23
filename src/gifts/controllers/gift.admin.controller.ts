import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GiftService } from '../services/gift.service';
import {
  CreateGiftDto,
  GetAllGiftsParamsDto,
  GetAllGiftsResponseDTO,
  UpdateGiftDto,
} from '../dto/gift.dto';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';
import { FileField, ReceiveFiles } from 'utils/multer.helper';
import { ApiOkResponse } from '@nestjs/swagger';

@SwaggerAdmin('Gift')
@Controller('admin/gifts')
export class GiftAdminController {
  constructor(private readonly giftService: GiftService) {}

  @ProtectRoute(['ADMIN'])
  @Post('/create')
  @ReceiveFiles([
    { name: 'imgEn', maxCount: 1 },
    { name: 'imgMl', maxCount: 1 },
  ])
  async create(
    @Body() dto: CreateGiftDto,
    @FileField('imgEn') imgEn: Express.Multer.File,
    @FileField('imgMl') imgMl: Express.Multer.File,
  ) {
    if (imgEn) dto.imgEn = imgEn.path;
    if (imgMl) dto.imgMl = imgMl.path;
    return await this.giftService.createGift(dto);
  }

  @ProtectRoute(['ADMIN'])
  @Post('/update')
  @ReceiveFiles([
    { name: 'imgEn', maxCount: 1 },
    { name: 'imgMl', maxCount: 1 },
  ])
  async update(
    @Body() dto: UpdateGiftDto,
    @FileField('imgEn') imgEn: Express.Multer.File,
    @FileField('imgMl') imgMl: Express.Multer.File,
  ) {
    if (imgEn) dto.imgEn = imgEn.path;
    if (imgMl) dto.imgMl = imgMl.path;
    return await this.giftService.updateGift(dto);
  }

  @ProtectRoute(['ADMIN'])
  @Post('toggle/:id')
  async toggle(@Param('id') id: string) {
    return await this.giftService.toggleGift(id);
  }

  @ProtectRoute(['ADMIN'])
  @Post('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.giftService.deleteGift(id);
  }

  @ProtectRoute(['ADMIN'])
  @Get('list')
  @ApiOkResponse({ type: GetAllGiftsResponseDTO })
  async list(
    @Query() params: GetAllGiftsParamsDto,
  ): Promise<GetAllGiftsResponseDTO> {
    return await this.giftService.findAdminGifts(params);
  }
}
