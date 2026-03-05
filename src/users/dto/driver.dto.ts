import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO, UpdateProfileParamsDTO } from '../../auth/dto/auth.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDriverProfileParamsDTO
  implements Partial<UpdateProfileParamsDTO> {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  photo: any;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vehicleNumber: string;
}

export class DriverProfile implements ProfileDTO {
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  photo: string;
  @ApiProperty()
  vehicleNumber: string;
  @ApiProperty()
  unreadMsgs: number;
}
