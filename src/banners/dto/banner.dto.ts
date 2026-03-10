import { ApiProperty } from '@nestjs/swagger';
import { Banner } from '@prisma/client';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FileField } from 'utils/multer.helper';
import { Limit, Skip } from 'utils/number.helper';

export class CreateBannerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    img: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    link: string;

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
    title?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    img?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    link?: string;

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
    img: string;
    @ApiProperty()
    link: string;
    @ApiProperty()
    storeId: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    updatedAt: Date;
}

export class GetAllBannersResponseDTO {
    @ApiProperty({ type: [BannerDTO] })
    data: BannerDTO[];
    @ApiProperty()
    total: number;
}
