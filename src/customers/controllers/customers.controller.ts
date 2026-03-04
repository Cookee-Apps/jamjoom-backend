import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';
import { UpdatedResponse } from 'utils/decorators/UpdatedResponse';
import {
  CustomerDTO,
  ListCustomersParamsDTO,
  ListCustomersResponseDTO,
} from '../dto/customers.dto';
import { CustomerService } from '../services/customers.service';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { InvalidateRouteCache } from 'utils/cache/cache.invalidate.interceptor';

@SwaggerAdmin('Customers')
@Controller('/admin/customers')
@ProtectRoute()
export class AdminCustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get('/list')
  @ApiOkResponse({ type: ListCustomersResponseDTO })
  async list(@Query() params: ListCustomersParamsDTO) {
    return await this.service.list(params);
  }

  @Post('/toggle/:customerId')
  @InvalidateRouteCache(['/list', '/detail'])
  @UpdatedResponse()
  @ApiParam({ name: 'customerId', type: 'string' })
  async toggle(@Param() params: { customerId: string }) {
    return await this.service.toggle(params.customerId);
  }

  @Get('/detail/:customerId')
  @ApiOkResponse({ type: CustomerDTO })
  async detail(@Param() params: { customerId: string }) {
    return await this.service.detail(params.customerId);
  }
}
