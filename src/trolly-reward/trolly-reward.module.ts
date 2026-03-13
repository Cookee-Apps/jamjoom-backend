import { Module } from '@nestjs/common';
import { TrollyRewardAdminController } from './controllers/trolly-reward.admin.controller';
import { TrollyRewardCustomerController } from './controllers/trolly-reward.customer.controller';
import { TrollyRewardService } from './services/trolly-reward.service';
import { TrollyRewardRepository } from './repositories/trolly-reward.repository';

@Module({
    controllers: [
        TrollyRewardAdminController,
        TrollyRewardCustomerController,
    ],
    providers: [TrollyRewardService, TrollyRewardRepository],
    exports: [TrollyRewardService],
})
export class TrollyRewardModule { }
