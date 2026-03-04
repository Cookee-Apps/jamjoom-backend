import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO, SendOTPParamsDTO, VerifyOTPParamsDTO } from './auth.dto';
import { OptionalString } from 'utils/string.helper';

export class SendOTPCustomerParamsDTO extends SendOTPParamsDTO {}

export class VerifyOTPCustomerParamsDTO extends VerifyOTPParamsDTO {
  @OptionalString({ default: '' })
  referralCode?: string;
}

export class CustomerProfileDTO extends ProfileDTO {}
