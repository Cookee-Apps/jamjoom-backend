import { Controller, Get, Query } from '@nestjs/common';
import { SwaggerCustomer } from 'utils/decorators/SwaggerDoc';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { TrollyRewardService } from '../services/trolly-reward.service';
import { GetAllTrollyRewardsResponseDTO } from '../dto/trolly-reward.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@SwaggerCustomer('Trolly Reward')
@Controller('customer/trolly-rewards')
export class TrollyRewardCustomerController {
    constructor(private readonly service: TrollyRewardService) { }

    @ProtectRoute(['CUSTOMER'])
    @Get('list')
    @ApiOkResponse({ type: GetAllTrollyRewardsResponseDTO })
    async list(
        @Query('limit') limit?: number,
        @Query('skip') skip?: number,
        @Query('storeId') storeId?: string,
    ) {
        return this.service.findAllCustomer({
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
            storeId,
        });
    }
}
