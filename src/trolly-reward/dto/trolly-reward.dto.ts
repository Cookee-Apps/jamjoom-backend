import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTrollyRewardDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    giftName: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsOptional()
    giftImage?: any;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    termsAndConditions: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    storeId: string;
}

export class UpdateTrollyRewardDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    giftName?: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    @IsOptional()
    giftImage?: any;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    termsAndConditions?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    storeId?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}

export class TrollyRewardResponseDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    giftName: string;

    @ApiProperty()
    giftImage: string;

    @ApiProperty()
    termsAndConditions: string;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    storeId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class GetAllTrollyRewardsResponseDTO {
    @ApiProperty({ type: [TrollyRewardResponseDTO] })
    data: TrollyRewardResponseDTO[];

    @ApiProperty()
    total: number;
}
