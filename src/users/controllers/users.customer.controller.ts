import { Body, Controller, Patch, Req } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerCustomer } from 'utils/decorators/SwaggerDoc';
import { Request } from 'express';
import { UpdateCurrentStoreDto } from '../dto/update-current-store.dto';

@SwaggerCustomer('User')
@Controller('customer/users')
export class UsersCustomerController {
    constructor(private readonly userService: UserService) { }

    @ProtectRoute(['CUSTOMER'])
    @Patch('current-store')
    async updateCurrentStore(@Req() req: Request, @Body() dto: UpdateCurrentStoreDto) {
        const user = req['user'];
        return await this.userService.updateAccount(user.id, {
            currentStoreId: dto.storeId,
        } as any);
    }
}
