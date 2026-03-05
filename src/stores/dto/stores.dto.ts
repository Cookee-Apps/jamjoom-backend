import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { TransformToDate } from 'utils/decorators/TransformToDate';
import { TransformToTime } from 'utils/decorators/TransformToTime';
import { IPaginateFind } from 'utils/generic-interfaces/IPaginateFind';
import {
  ConvertToNumber,
  Limit,
  OptionalDecimal,
  Skip,
} from 'utils/number.helper';
import { OptionalString } from 'utils/string.helper';
import { IsValidStore } from '../decorators/check-valid-store';
import { Type } from 'class-transformer';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  storeManager?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  location?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  storeImage?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  longitude?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  serviceRadius?: number;

  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @IsPhoneNumber()
  contactNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  whatsappNotificationNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locationEmbedLink?: string;
}

export class UpdateStoreDto implements Partial<CreateStoreDto> {
  @ApiProperty()
  @IsValidStore()
  id: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  storeManager?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  active?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  storeImage?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  address?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @ConvertToNumber()
  latitude?: number;

  @IsOptional()
  @ApiPropertyOptional()
  @ConvertToNumber()
  longitude?: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  serviceRadius?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  contactNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locationEmbedLink?: string;
}

export class ToggleStoreDto {
  @IsValidStore()
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}

export class DeleteStoreDto {
  @IsValidStore()
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}

export class GetAllStoresParamsDto implements IPaginateFind {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  searchText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @TransformToDate()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @TransformToDate()
  to?: Date;

  @Limit()
  limit: number;

  @Skip()
  skip: number;
}

export class AddressIdDto {
  @OptionalString()
  addressId: string;

  @OptionalDecimal()
  longitude?: Prisma.Decimal;

  @OptionalDecimal()
  latitude?: Prisma.Decimal;
}

export class CheckStoreIsServiceableDto extends AddressIdDto {
  @IsNotEmpty()
  @IsValidStore()
  @ApiProperty()
  storeId: string;
}

export class UpdateStoreProfileDto extends OmitType(UpdateStoreDto, [
  'id',
] as const) { }
