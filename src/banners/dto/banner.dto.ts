import { ApiProperty } from '@nestjs/swagger';
import { Banner } from '@prisma/client';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Limit, Skip } from 'utils/number.helper';

export class CreateBannerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    titleEn: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    titleMl: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    imgEn: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    imgMl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    linkEn: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    linkMl: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    storeId: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}

export class UpdateBannerDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    titleEn?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    titleMl?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    imgEn?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    imgMl?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    linkEn?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    linkMl?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}

export class GetAllBannersParamsDto {
    @IsUUID()
    @IsOptional()
    storeId?: string;

    @Limit()
    limit?: number;

    @Skip()
    skip?: number;
}

export class BannerDTO implements Banner {
    @ApiProperty()
    active: boolean;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    id: string;
    @ApiProperty()
    imgEn: string;
    @ApiProperty()
    imgMl: string;
    @ApiProperty()
    linkEn: string;
    @ApiProperty()
    linkMl: string;
    @ApiProperty()
    storeId: string;
    @ApiProperty()
    titleEn: string;
    @ApiProperty()
    titleMl: string;
    @ApiProperty()
    updatedAt: Date;
}

export class GetAllBannersResponseDTO {
    @ApiProperty({ type: [BannerDTO] })
    data: BannerDTO[];
    @ApiProperty()
    total: number;
}
