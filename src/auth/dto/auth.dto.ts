import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import ErrorMessages from '../constants/error_messages';
import {
  ICheckPhoneNumberDTO,
  ICheckReferralCodeDTO,
  IJWTPayload,
  ILoginDto,
  ILoginResponseTypeDTO,
  IProfileDTO,
  ISendOTPParamsDTO,
  ISendOTPResponseDTO,
  IUpdateProfileParamsDTO,
  IVerifyOTPParamsDTO,
} from '../interfaces/auth.dto.interface';
import { OptionalString } from 'utils/string.helper';
import { FileAPIProperty } from 'utils/decorators/FileAPIProperty';

export class LoginDto implements ILoginDto {
  @ApiProperty({ default: 'admin1' })
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({ default: 'admin123' })
  @IsString()
  @IsNotEmpty()
  password: string;
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsString()
  firebaseToken?: string;
}

export class ProfileDTO implements IProfileDTO {
  @ApiProperty()
  id: string;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  username?: string | null;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  phoneNumber?: string | null;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  firstName?: string | null;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  lastName?: string | null;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  referralCode?: string | undefined;
  @ApiProperty()
  unreadMsgs: number
}

export class UpdateProfileParamsDTO
  implements Partial<ProfileDTO>, IUpdateProfileParamsDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;
}

export class LoginResponseTypeDTO implements ILoginResponseTypeDTO {
  @ApiProperty()
  readonly token: string;
  @ApiProperty()
  driverId?: string
  @ApiProperty({ type: ProfileDTO })
  readonly userData: ProfileDTO & { timestamp: Date };
}

export class JWTPayload implements IJWTPayload {
  sessionId: string;
  userId: string;
  timestamp: string;
}

const defaultPhoneNumber = '+918078675633';

export class SendOTPParamsDTO implements ISendOTPParamsDTO {
  @ApiProperty({ default: defaultPhoneNumber })
  @IsPhoneNumber(undefined, { message: 'Please Enter Valid Mobile Number' })
  phoneNumber: string;
  @ApiProperty({ default: false })
  @IsBoolean()
  @IsNotEmpty()
  whatsapp: boolean;
}

export class SendOTPResponseDTO implements ISendOTPResponseDTO {
  @ApiProperty()
  existing: boolean;
  @ApiProperty({ default: 300 })
  secondsToExpiry: number;
  @ApiProperty({
    default: false,
    description:
      "Indicates if the OTP was sent, if false, wait for 'secondsToExpiry' seconds",
  })
  sent: boolean;
}

export class VerifyOTPParamsDTO implements IVerifyOTPParamsDTO {
  @ApiProperty({ default: defaultPhoneNumber })
  @IsPhoneNumber(undefined, { message: 'Please Enter Valid UAE Mobile Number' })
  phoneNumber: string;
  @ApiProperty({ default: process.env.OTP_TO_USE })
  @IsString()
  @Length(Number(process.env.OTP_LENGTH), undefined, {
    message: ErrorMessages.invalidOrExpiredOTP,
  })
  otp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firebaseToken?: string;
}

export class CheckPhoneNumberDTO implements ICheckPhoneNumberDTO {
  @ApiProperty({ default: defaultPhoneNumber })
  @IsPhoneNumber(undefined, { message: 'Please Enter Valid UAE Mobile Number' })
  phoneNumber: string;
}

export class CheckReferralCodeDTO implements ICheckReferralCodeDTO {
  @ApiProperty({ default: 'SPINABC005' })
  @IsString()
  @IsNotEmpty()
  referralCode: string;
}

export class DriverUpdateProfileParamsDTO extends PartialType(
  UpdateProfileParamsDTO,
) {
  @OptionalString()
  storeId?: string;

  @OptionalString()
  vehicleNumber?: string;

  @IsOptional()
  @FileAPIProperty()
  photo?: any;
}
