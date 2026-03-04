import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { SwaggerCustomer } from 'utils/decorators/SwaggerDoc';
import { ConfigurationResponseDto } from '../dto/configuration.dto';
import { ConfigurationService } from '../services/configuration.service';

@SwaggerCustomer('Configuration')
@Controller('customer/configuration')
export class ConfigurationCustomerController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get('list')
  @ApiOkResponse({ type: [ConfigurationResponseDto] })
  getConfiguration() {
    return this.configurationService.getConfiguration();
  }
}
