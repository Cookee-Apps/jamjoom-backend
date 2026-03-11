import { Body, Controller, Get, Param, Post, Query, UploadedFile } from '@nestjs/common';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { ComplaintCategoryService } from '../services/complaint-category.service';
import { CreateComplaintCategoryDto, GetAllComplaintCategoriesResponseDTO, UpdateComplaintCategoryDto } from '../dto/complaint-category.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { FileField, ReceiveFile } from 'utils/multer.helper';

@SwaggerAdmin('Complaint Category')
@Controller('admin/complaint-categories')
export class ComplaintCategoryAdminController {
    constructor(private readonly service: ComplaintCategoryService) { }

    @ProtectRoute(['ADMIN'])
    @Post('create')
    @ReceiveFile('icon')
    async create(@Body() dto: CreateComplaintCategoryDto, @FileField('icon') file: Express.Multer.File) {
        return this.service.create({ ...dto, icon: file })
    }

    @ProtectRoute(['ADMIN'])
    @Post('update')
    @ReceiveFile('icon')
    async update(@Body() dto: UpdateComplaintCategoryDto, @FileField('icon') file: Express.Multer.File) {
        return this.service.update({ ...dto, icon: file });
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
    @ApiOkResponse({ type: GetAllComplaintCategoriesResponseDTO })
    async list(
        @Query('limit') limit?: number,
        @Query('skip') skip?: number,
    ) {
        return this.service.findAllAdmin({
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
        });
    }
}
