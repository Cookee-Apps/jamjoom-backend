import { Module } from '@nestjs/common';
import { ComplaintAdminController } from './controllers/complaint.admin.controller';
import { ComplaintService } from './services/complaint.service';
import { ComplaintRepository } from './repositories/complaint.repository';
import { ComplaintCustomerController } from './controllers/complaint.customer.controller';

@Module({
  controllers: [ComplaintAdminController, ComplaintCustomerController],
  providers: [ComplaintService, ComplaintRepository],
  exports: [ComplaintService],
})
export class ComplaintsModule {}
