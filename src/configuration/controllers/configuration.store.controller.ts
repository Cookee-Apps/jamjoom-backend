import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ProtectRoute } from 'src/auth/guards/auth.guard';
import { ConfigurationResponseDto } from '../dto/configuration.dto';
import { ConfigurationService } from '../services/configuration.service';
import { SwaggerStore } from 'utils/decorators/SwaggerDoc';

@SwaggerStore('Configuration')
@Controller('/store/configuration')
export class ConfigurationStoreController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get('list')
  @ProtectRoute(['STORE_MANAGER'])
  @ApiOkResponse({ type: [ConfigurationResponseDto] })
  getConfiguration() {
    return this.configurationService.getConfiguration();
  }
}
