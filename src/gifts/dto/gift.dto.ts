import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { FileAPIProperty } from 'utils/decorators/FileAPIProperty';

export class CreateGiftDto {
  @ApiProperty({ example: 'Free Coffee' })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({ example: 'സൗജന്യ കോഫി' })
  @IsString()
  @IsNotEmpty()
  nameMl: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @FileAPIProperty()
  imgEn?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @FileAPIProperty()
  imgMl?: string;

  @ApiProperty({ example: 'Terms and conditions apply...' })
  @IsString()
  @IsNotEmpty()
  tAndcEn: string;

  @ApiProperty({ example: 'നിബന്ധനകളും വ്യവസ്ഥകളും ബാധകമാണ്...' })
  @IsString()
  @IsNotEmpty()
  tAndcMl: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  perDayGiftLimit?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  remainingStock?: number;
}

export class UpdateGiftDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ example: 'Free Coffee' })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @ApiPropertyOptional({ example: 'സൗജന്യ കോഫി' })
  @IsString()
  @IsOptional()
  nameMl?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @FileAPIProperty()
  imgEn?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @FileAPIProperty()
  imgMl?: string;

  @ApiPropertyOptional({ example: 'Terms and conditions apply...' })
  @IsString()
  @IsOptional()
  tAndcEn?: string;

  @ApiPropertyOptional({ example: 'നിബന്ധനകളും വ്യവസ്ഥകളും ബാധകമാണ്...' })
  @IsString()
  @IsOptional()
  tAndcMl?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  perDayGiftLimit?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  remainingStock?: number;
}

export class GetAllGiftsParamsDto {
  @IsUUID()
  @IsOptional()
  storeId?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  skip?: number;
}

export class GiftResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameMl: string;

  @ApiProperty()
  imgEn: string;

  @ApiProperty()
  imgMl: string;

  @ApiProperty()
  tAndcEn: string;

  @ApiProperty()
  tAndcMl: string;

  @ApiProperty()
  storeId: string;

  @ApiProperty()
  active: boolean;

  @ApiPropertyOptional({ type: () => GiftConfigResponseDto, nullable: true })
  config?: GiftConfigResponseDto | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GiftConfigResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  giftId: string;

  @ApiProperty()
  perDayGiftLimit: number;

  @ApiProperty()
  remainingStock: number;
}

export class GetAllGiftsResponseDTO {
  @ApiProperty({ type: [GiftResponseDto] })
  data: GiftResponseDto[];

  @ApiProperty()
  total: number;
}
