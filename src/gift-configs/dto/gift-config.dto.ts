import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateGiftConfigDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  giftId: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  perDayGiftLimit?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  remainingStock?: number;
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
