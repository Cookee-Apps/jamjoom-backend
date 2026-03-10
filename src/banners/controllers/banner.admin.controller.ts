import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BannerService } from '../services/banner.service';
import { CreateBannerDto, GetAllBannersParamsDto, GetAllBannersResponseDTO, UpdateBannerDto } from '../dto/banner.dto';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';

import { FileField, ReceiveFile } from 'utils/multer.helper';
import { ApiOkResponse } from '@nestjs/swagger';

@SwaggerAdmin('Banner')
@Controller('admin/banners')
export class BannerAdminController {
    constructor(private readonly bannerService: BannerService) { }

    @ProtectRoute(['ADMIN'])
    @Post('/create')
    @ReceiveFile('img')
    async create(
        @Body() dto: CreateBannerDto,
        @FileField('img') img: Express.Multer.File,
    ) {
        if (img) dto.img = img.path;
        return await this.bannerService.createBanner(dto);
    }

    @ProtectRoute(['ADMIN'])
    @Post('/update')
    @ReceiveFile('img')
    async update(
        @Body() dto: UpdateBannerDto,
        @FileField('img') img: Express.Multer.File,
    ) {
        if (img) dto.img = img.path;
        return await this.bannerService.updateBanner(dto);
    }

    @ProtectRoute(['ADMIN'])
    @Post('toggle/:id')
    async toggle(@Param('id') id: string) {
        return await this.bannerService.toggleBanner(id);
    }

    @ProtectRoute(['ADMIN'])
    @Post('delete/:id')
    async remove(@Param('id') id: string) {
        return await this.bannerService.deleteBanner(id);
    }

    @ProtectRoute(['ADMIN'])
    @Get('list')
    @ApiOkResponse({ type: GetAllBannersResponseDTO })
    async list(@Query() params: GetAllBannersParamsDto): Promise<GetAllBannersResponseDTO> {
        return await this.bannerService.findAdminBanners(params);
    }
}
