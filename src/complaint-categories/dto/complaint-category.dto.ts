import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FileAPIProperty } from 'utils/decorators/FileAPIProperty';

export class CreateComplaintCategoryDto {
    @ApiProperty({ example: 'Service Quality' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @FileAPIProperty()
    icon?: Express.Multer.File;
}

export class UpdateComplaintCategoryDto {
    @ApiProperty({ example: 'uuid-v4-id' })
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @ApiPropertyOptional({ example: 'Billing Issue' })
    @IsString()
    @IsOptional()
    name?: string;

    @IsOptional()
    @FileAPIProperty()
    icon?: Express.Multer.File;
}

export class ComplaintCategoryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    icon: string;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class GetAllComplaintCategoriesResponseDTO {
    @ApiProperty({ type: [ComplaintCategoryResponseDto] })
    data: ComplaintCategoryResponseDto[];

    @ApiProperty()
    total: number;
}
