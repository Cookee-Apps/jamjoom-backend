import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { ConfigValueValidator } from '../validation/configuration.validation';
import {
  ConfigKey,
  IConfigurationDto,
  IConfigurationResponseDto,
} from '../interfaces/configuration.dto.interface';
import { FileAPIProperty } from 'utils/decorators/FileAPIProperty';
import { ConvertToBoolean } from 'utils/boolean.helper';

const VALID_CONFIG_KEYS = Object.values(ConfigKey);
export class ConfigurationDto implements IConfigurationDto {
  @ApiProperty({ example: ConfigKey.refereeBonus, enum: ConfigKey })
  @IsNotEmpty()
  @IsString()
  @IsIn(VALID_CONFIG_KEYS, { message: 'Invalid configuration key' })
  key: string;

  @ApiProperty({ example: '10' })
  @IsNotEmpty()
  @IsString()
  @Validate(ConfigValueValidator)
  value: string;
}

export class ConfigurationResponseDto implements IConfigurationResponseDto {
  @ApiProperty({ example: '875b5282-79cc-4298-8fcf-d911f5a40668' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'referral_bonus' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ example: '10' })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;
}

export class GetConfigByKey {
  @ApiProperty({ example: 'referral_bonus' })
  @IsNotEmpty()
  @IsString()
  @IsIn(VALID_CONFIG_KEYS.map((key) => key), {
    message: 'Invalid configuration key',
  })
  key: string;
}

export class UpdateBannerConfigDTO {
  @FileAPIProperty()
  @IsOptional()
  photo: Express.Multer.File

  @ApiProperty()
  @ConvertToBoolean()
  @IsBoolean()
  app: boolean
}
