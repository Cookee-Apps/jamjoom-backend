import { Controller, Get, Param, Query } from '@nestjs/common';
import { CustomerDTO, ListCustomersParamsDTO, ListCustomersResponseDTO } from '../dto/customers.dto';
import { CustomerService } from '../services/customers.service';
import { SwaggerStore } from 'utils/decorators/SwaggerDoc';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { CurrentStore } from 'src/stores/decorators/current-store';
import { Store } from '@prisma/client';

@SwaggerStore('Customers')
@Controller('/store/customers')
@ProtectRoute(['STORE_MANAGER'])
export class StoreCustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get('/list')
  @ApiOkResponse({ type: ListCustomersResponseDTO })
  async list(@Query() params: ListCustomersParamsDTO, @CurrentStore() store: Store) {
    return await this.service.list({ ...params, storeId: store.id });
  }

  @Get('/detail/:customerId')
  @ApiOkResponse({ type: CustomerDTO })
  async detail(@Param() params: { customerId: string }) {
    return await this.service.detail(params.customerId);
  }
}
