import { Controller, Get, Query } from '@nestjs/common';
import { SwaggerCustomer } from 'utils/decorators/SwaggerDoc';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { ComplaintCategoryService } from '../services/complaint-category.service';
import { GetAllComplaintCategoriesResponseDTO } from '../dto/complaint-category.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@SwaggerCustomer('Complaint Category')
@Controller('customer/complaint-categories')
export class ComplaintCategoryCustomerController {
    constructor(private readonly service: ComplaintCategoryService) { }

    @ProtectRoute(['CUSTOMER'])
    @Get('list')
    @ApiOkResponse({ type: GetAllComplaintCategoriesResponseDTO })
    async list(
        @Query('limit') limit?: number,
        @Query('skip') skip?: number,
    ) {
        return this.service.findAllCustomer({
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
        });
    }
}
