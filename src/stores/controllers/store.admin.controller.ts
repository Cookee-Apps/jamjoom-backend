import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { StoreService } from '../service/stores.service';
import {
  AddressIdDto,
  CheckStoreIsServiceableDto,
  CreateStoreDto,
  DeleteStoreDto,
  GetAllStoresParamsDto,
  ToggleStoreDto,
  UpdateStoreDto,
} from '../dto/stores.dto';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';
import { InvalidateRouteCache } from 'utils/cache/cache.invalidate.interceptor';
import { KeysForRevalidate } from '../cache/keys-for-revalidate';
import { FileField, ReceiveFile } from 'utils/multer.helper';

@SwaggerAdmin('Store')
@Controller('admin/stores')
export class StoreAdminController {
  constructor(private readonly storeService: StoreService) { }

  @Post('add')
  @ProtectRoute()
  @ReceiveFile('storeImage')
  @InvalidateRouteCache(KeysForRevalidate)
  async createStore(
    @Body() params: CreateStoreDto,
    @FileField('storeImage') storeImage: Express.Multer.File,
  ) {
    return await this.storeService.createStore({ ...params, storeImage });
  }

  @Post('update')
  @ProtectRoute()
  @ReceiveFile('storeImage')
  @InvalidateRouteCache(KeysForRevalidate)
  async updateStore(
    @Body() params: UpdateStoreDto,
    @FileField('storeImage') storeImage: Express.Multer.File,
  ) {
    return await this.storeService.updateStore({ ...params, storeImage });
  }

  @Post('toggle')
  @ProtectRoute()
  @InvalidateRouteCache(KeysForRevalidate)
  async toggleStore(@Body() params: ToggleStoreDto) {
    return await this.storeService.toggleStore(params);
  }

  @Post('delete')
  @ProtectRoute()
  @InvalidateRouteCache(KeysForRevalidate)
  async deleteStore(@Body() params: DeleteStoreDto) {
    return await this.storeService.deleteStore(params);
  }

  @Get('list')
  @ProtectRoute()
  async getAllStores(@Query() params: GetAllStoresParamsDto) {
    return await this.storeService.getAllStores(params);
  }

}
