import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { ComplaintService } from '../services/complaint.service';
import {
  CreateComplaintDto,
  GetAllComplaintsResponseDTO,
  UpdateComplaintDto,
} from '../dto/complaint.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { FilesField, ReceiveFiles } from 'utils/multer.helper';

@SwaggerAdmin('Complaint')
@Controller('admin/complaints')
@ProtectRoute(['ADMIN'])
export class ComplaintAdminController {
  constructor(private readonly service: ComplaintService) {}

  @Post('create')
  @ReceiveFiles([{ name: 'photos', maxCount: 10 }])
  async create(
    @Body() dto: CreateComplaintDto,
    @FilesField('photos') photos: Express.Multer.File[],
  ) {
    return this.service.create({ ...dto, photos });
  }

  @Post('update')
  @ReceiveFiles([{ name: 'photos', maxCount: 10 }])
  async update(
    @Body() dto: UpdateComplaintDto,
    @FilesField('photos') photos: Express.Multer.File[],
  ) {
    return this.service.update({ ...dto, photos });
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get('list')
  @ApiOkResponse({ type: GetAllComplaintsResponseDTO })
  async list(
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    return this.service.findAllAdmin({
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
