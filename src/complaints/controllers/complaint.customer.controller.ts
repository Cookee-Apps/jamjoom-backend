import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { SwaggerCustomer } from 'utils/decorators/SwaggerDoc';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { ComplaintService } from '../services/complaint.service';
import { CustomerCreateComplaintDto } from '../dto/complaint.dto';
import { FilesField, ReceiveFiles } from 'utils/multer.helper';

@SwaggerCustomer('Complaint')
@Controller('customer/complaints')
export class ComplaintCustomerController {
  constructor(private readonly service: ComplaintService) { }

  @ProtectRoute(['CUSTOMER'])
  @Post('create')
  @ReceiveFiles([{ name: 'photos', maxCount: 10 }])
  async create(
    @Req() req: Request,
    @Body() dto: CustomerCreateComplaintDto,
    @FilesField('photos') photos: Express.Multer.File[],
  ) {
    const user = req['user'];
    return this.service.create({ ...dto, userId: user.id, photos });
  }

  @ProtectRoute(['CUSTOMER'])
  @Get('list')
  async list(
    @Req() req: Request,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    const user = req['user'];
    return this.service.findAllByCustomer(user.id, {
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }
}
