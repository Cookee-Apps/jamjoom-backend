import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StoreService } from '../service/stores.service';
import { SwaggerStore } from 'utils/decorators/SwaggerDoc';
import { AddressIdDto, UpdateStoreProfileDto } from '../dto/stores.dto';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { CurrentStore } from '../decorators/current-store';
import { Store } from '@prisma/client';

@Controller('store/stores')
@SwaggerStore('Store')
@ProtectRoute(['STORE_MANAGER'])
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/update-our-store')
  async updateStore(
    @Body() params: UpdateStoreProfileDto,
    @CurrentStore() store: Store,
  ) {
    return await this.storeService.updateStore({ ...params, id: store.id });
  }

  @Get('check_is_serviceable')
  async checkIsStoreUnderTheServiceRadius(
    @Query() params: AddressIdDto,
    @CurrentStore() store: Store,
  ) {
    return await this.storeService.checkIsAddressUnderTheServiceRadius({
      ...params,
      storeId: store.id,
    });
  }
}
