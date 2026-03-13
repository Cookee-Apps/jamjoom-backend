import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { TrollyRewardService } from '../services/trolly-reward.service';
import { CreateTrollyRewardDto, GetAllTrollyRewardsResponseDTO, UpdateTrollyRewardDto } from '../dto/trolly-reward.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { FileField, ReceiveFile } from 'utils/multer.helper';

@SwaggerAdmin('Trolly Reward')
@Controller('admin/trolly-rewards')
export class TrollyRewardAdminController {
    constructor(private readonly service: TrollyRewardService) { }

    @ProtectRoute(['ADMIN'])
    @Post('create')
    @ReceiveFile('giftImage')
    async create(@Body() dto: CreateTrollyRewardDto, @FileField('giftImage') file: Express.Multer.File) {
        return this.service.create({ ...dto, giftImage: file })
    }

    @ProtectRoute(['ADMIN'])
    @Post('update')
    @ReceiveFile('giftImage')
    async update(@Body() dto: UpdateTrollyRewardDto, @FileField('giftImage') file: Express.Multer.File) {
        return this.service.update({ ...dto, giftImage: file });
    }

    @ProtectRoute(['ADMIN'])
    @Post('toggle/:id')
    async toggle(@Param('id') id: string) {
        return this.service.toggleActive(id);
    }

    @ProtectRoute(['ADMIN'])
    @Post('delete/:id')
    async delete(@Param('id') id: string) {
        return this.service.delete(id);
    }

    @ProtectRoute(['ADMIN'])
    @Get('list')
    @ApiOkResponse({ type: GetAllTrollyRewardsResponseDTO })
    async list(
        @Query('limit') limit?: number,
        @Query('skip') skip?: number,
        @Query('storeId') storeId?: string,
    ) {
        return this.service.findAllAdmin({
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
            storeId,
        });
    }
}
