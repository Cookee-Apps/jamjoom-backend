import { Store } from '@prisma/client';

export interface ILoginDto {
    email: string;
    password: string;
}

export interface IProfileDTO {
    id: string;
    email?: string | null;
    phoneNumber?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    referralCode?: string
}

export interface IUpdateProfileParamsDTO extends Partial<IProfileDTO> {
    email?: string;
    firstName?: string;
    lastName?: string;
}

export interface ILoginResponseTypeDTO {
    token: string;
    userData: IProfileDTO & { timestamp: Date };
}

export interface IJWTPayload {
    sessionId: string;
    userId: string;
    timestamp: string;
}

export interface ISendOTPParamsDTO {
    phoneNumber: string;
    whatsapp: boolean;
}

export interface ISendOTPResponseDTO {
    existing: boolean;
    secondsToExpiry: number;
    sent: boolean;
}

export interface IVerifyOTPParamsDTO {
    phoneNumber: string;
    otp: string;
}

export interface ICheckPhoneNumberDTO {
    phoneNumber: string;
}

export interface ICheckReferralCodeDTO {
    referralCode: string;
}
  