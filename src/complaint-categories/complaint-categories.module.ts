import { Module } from '@nestjs/common';
import { ComplaintCategoryAdminController } from './controllers/complaint-category.admin.controller';
import { ComplaintCategoryCustomerController } from './controllers/complaint-category.customer.controller';
import { ComplaintCategoryService } from './services/complaint-category.service';
import { ComplaintCategoryRepository } from './repositories/complaint-category.repository';

@Module({
    controllers: [
        ComplaintCategoryAdminController,
        ComplaintCategoryCustomerController,
    ],
    providers: [ComplaintCategoryService, ComplaintCategoryRepository],
    exports: [ComplaintCategoryService],
})
export class ComplaintCategoriesModule { }
