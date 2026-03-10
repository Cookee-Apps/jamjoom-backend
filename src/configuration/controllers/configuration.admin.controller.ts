import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigurationService } from '../services/configuration.service';
import {
  ConfigurationDto,
  ConfigurationResponseDto,
  UpdateBannerConfigDTO,
} from '../dto/configuration.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { InvalidateRouteCache } from 'utils/cache/cache.invalidate.interceptor';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';
import { FileField, ReceiveFile } from 'utils/multer.helper';
import { UpdatedResponse } from 'utils/decorators/UpdatedResponse';

@SwaggerAdmin('Configuration')
@Controller('admin/configuration')
export class ConfigurationAdminController {
  constructor(private readonly configurationService: ConfigurationService) { }

  @Get('list')
  @ProtectRoute()
  @ApiOkResponse({ type: ConfigurationResponseDto })
  getConfiguration() {
    return this.configurationService.getConfiguration();
  }

  @Post('update')
  @ProtectRoute()
  @InvalidateRouteCache('/list')
  @ApiBody({ type: ConfigurationDto, isArray: true })
  updateConfiguration(@Body() dto: ConfigurationDto[]) {
    return this.configurationService.updateConfiguration(dto);
  }

  @Post('/update_banner_image')
  @UpdatedResponse()
  @ReceiveFile('photo')
  @ProtectRoute()
  @InvalidateRouteCache('/list')
  @ApiBody({ type: UpdateBannerConfigDTO })
  async updateBannerConfig(
    @Body() dto: UpdateBannerConfigDTO,
    @FileField('photo') photo: Express.Multer.File,
  ) {
    return await this.configurationService.updateBannerImage({
      app: dto.app,
      photo,
    });
  }
}
