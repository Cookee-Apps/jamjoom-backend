import { Controller, Get, Query } from '@nestjs/common';
import { StoreService } from '../service/stores.service';
import { AddressIdDto, GetAllStoresParamsDto } from '../dto/stores.dto';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerCustomer } from 'utils/decorators/SwaggerDoc';

@SwaggerCustomer('Store')
@Controller('customer/stores')
export class StoreCustomerController {
  constructor(private readonly storeService: StoreService) {}

  @Get('list')
  public async listStores(
    @Query() params: Omit<GetAllStoresParamsDto, 'from' | 'to'>,
  ) {
    return this.storeService.getAllStores(params);
  }
}
