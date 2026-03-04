import { OptionalString } from 'utils/string.helper';
import { ProfileDTO } from './auth.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class DriverProfileDto extends ProfileDTO {

  @ApiPropertyOptional()
  driverId: string

  @OptionalString()
  photo?: string | null;

  @OptionalString()
  storeName?: string | null;

  @OptionalString()
  storeAddress?: string | null;

  @OptionalString()
  vehicleNumber?: string | null;

  @ApiPropertyOptional()
  @IsBoolean()
  active?: boolean;
}
