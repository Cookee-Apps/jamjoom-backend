import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FileAPIProperty } from 'utils/decorators/FileAPIProperty';

export class CreateComplaintDto {
  @ApiProperty({ example: 'My order arrived damaged' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'uuid-v4-id' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'uuid-v4-id' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @FileAPIProperty(true, 'photos', false)
  photos?: Express.Multer.File[];
}

export class UpdateComplaintDto {
  @ApiProperty({ example: 'uuid-v4-id' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ example: 'My order arrived damaged' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-v4-id' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-v4-id' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsOptional()
  @FileAPIProperty(true, 'photos', false)
  photos?: Express.Multer.File[];

  @IsOptional()
  @ApiPropertyOptional({ type: [String], description: 'IDs of photos to delete' })
  photosToDelete?: string[];
}

export class ComplaintPhotoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;
}

export class ComplaintCategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameMl: string;

  @ApiProperty()
  icon: string;
}

export class ComplaintResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: ComplaintCategoryResponseDto })
  category: ComplaintCategoryResponseDto;

  @ApiProperty({ type: [ComplaintPhotoResponseDto] })
  photos: ComplaintPhotoResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetAllComplaintsResponseDTO {
  @ApiProperty({ type: [ComplaintResponseDto] })
  data: ComplaintResponseDto[];

  @ApiProperty()
  total: number;
}

export class CustomerCreateComplaintDto {
  @ApiProperty({ example: 'My order arrived damaged' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'uuid-v4-id' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @FileAPIProperty(true, 'photos', false)
  photos?: Express.Multer.File[];
}
