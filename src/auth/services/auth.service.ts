import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SessionService } from '../../session/services/session.service';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { RoleNames, RoleNamesObj } from 'src/roles/constants/role.constants';
import { RoleService } from 'src/roles/services/role.service';
import DateHelpers from 'utils/date.helper';
import { Logger } from 'utils/logger/logger.service';
import { PasswordService } from 'utils/passwords.service';
import { generateOTP } from 'utils/string.helper';
import { UserService } from '../../users/services/users.service';
import ErrorMessages from '../constants/error_messages';
import {
  JWTPayload,
  LoginDto,
  LoginResponseTypeDTO,
  SendOTPParamsDTO,
  SendOTPResponseDTO,
  UpdateProfileParamsDTO,
  VerifyOTPParamsDTO,
} from '../dto/auth.dto';
import { OTPRepository } from '../repositories/otp.repository';
import { CustomerService } from 'src/customers/services/customers.service';
import TransactionService from 'utils/db/transaction.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly otpRepository: OTPRepository,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly logger: Logger
  ) { }

  private async generateTokens(accountId: string, sessionId: string) {
    let refreshTokenTimeout = Number(
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRES').split('d')[0],
    );
    refreshTokenTimeout = refreshTokenTimeout * 24 * 60;
    const expiresAt = DateHelpers.addMinutesToDate(refreshTokenTimeout);
    const refreshToken = await this.sessionService.createRefreshToken(
      sessionId,
      expiresAt,
    );
    return {
      token: this.signJWT(
        { userId: accountId, sessionId },
        process.env.JWT_ACCESS_TOKEN_EXPIRES,
      ),
      refreshToken: this.signJWT(
        { id: refreshToken.id },
        process.env.JWT_REFRESH_TOKEN_EXPIRES,
      ),
    };
  }

  private async createSession(
    account: Users,
    sessionId: string,
    referralCode: string,
  ): Promise<LoginResponseTypeDTO> {
    const tokens = await this.generateTokens(account.id, sessionId);
    return {
      ...tokens,
      userData: {
        username: account.username,
        id: account.id,
        referralCode,
        firstName: account.firstName,
        lastName: account.lastName,
        phoneNumber: account.phoneNumber,
        timestamp: DateHelpers.getCurrentDate(),
        unreadMsgs: 0
        // await this.getUnreadNotificationCount(account.id),
      }
    };
  }

  async validateLogin(loginDto: LoginDto): Promise<LoginResponseTypeDTO> {
    try {
      const account = await this.userService.findOneByUsername(
        loginDto.username,
      );
      if (!account)
        throw new BadRequestException(ErrorMessages.invalidCredentials);
      const roleDetails = await this.roleService.getRoleById(account.roleId);
      if (roleDetails?.name !== RoleNamesObj.ADMIN) {
        throw new BadRequestException(ErrorMessages.invalidCredentials);
      }
      if (!account.password) throw new BadRequestException();
      const isValidPassword = await this.passwordService.comparePasswords(
        loginDto.password,
        account.password,
      );
      if (!isValidPassword)
        throw new BadRequestException(ErrorMessages.invalidCredentials);
      const createdSessionId = await this.sessionService.createSession(
        account.id,
        loginDto.firebaseToken
      );
      this.userService.updateAccount(account.id, {
        lastLoginAt: DateHelpers.getCurrentDate(),
      });
      return await this.createSession(account, createdSessionId, '');
    } catch (error) {
      throw new BadRequestException(
        error.message ?? ErrorMessages.invalidCredentials,
      );
    }
  }

  private signJWT(payload: Record<string, string>, expiresIn?: string) {
    return this.jwtService.sign(payload, { expiresIn });
  }

  async logout(sessionId: string) {
    await this.sessionService.deleteSession(sessionId);
    return { loggedOut: true };
  }

  getToken(token: string) {
    return token.split('Bearer ')[1];
  }

  async getJWTPayload<T extends object = JWTPayload>(jwt: string) {
    return await this.jwtService.verifyAsync<T>(jwt, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async sendOTP(
    params: SendOTPParamsDTO & { role: string },
  ): Promise<SendOTPResponseDTO> {
    const currentTime = DateHelpers.getCurrentDate();
    const account = await this.userService.findOneByPhoneNumber(
      params.phoneNumber,
      params.role,
    );
    if (params.role !== RoleNamesObj.CUSTOMER && !account) {
      // if account is not present
      // and requesting app is driver/store
      throw new BadRequestException('No Account found');
    }
    if (account && !account.active) {
      throw new BadRequestException(
        'Your account has been deactivated. Please contact support',
      );
    }
    return await this.transactionService.runTransaction(async (db) => {
      // Find an OTP that hasn't expired (expiresAt > currentTime)
      let sent = false;
      let otp = await this.otpRepository.findOne({
        phoneNumber: params.phoneNumber,
        expiresAt: { gt: currentTime },
      }, db);
      let secondsToExpiry =
        this.configService.get('OTP_VALID_TIME_IN_MINUTES') * 60; // Default to OTP valid time in seconds
      if (otp) {
        // If an OTP exists and is valid, return it
        secondsToExpiry = DateHelpers.diffInSeconds(currentTime, otp.expiresAt);
      } else {
        // Delete all expired or existing OTPs for this phone number
        await this.otpRepository.deleteMany({ phoneNumber: params.phoneNumber }, db);

        // Generate a new OTP
        const sampleOTP = this.configService.get('OTP_TO_USE') as string
        let generatedOtp = this.configService.get('USE_SAME_OTP_FOR_ALL')
          ? sampleOTP
          : generateOTP(this.configService.get('OTP_LENGTH'));
        let samplePhoneNumber = `+971${this.configService.get('SAMPLE_WHATSAPP_PHONE_NUMBER')}`
        const samplePhoneNumberUsed = params.phoneNumber === samplePhoneNumber
        if (samplePhoneNumberUsed) generatedOtp = sampleOTP;

        // Create a new OTP record
        const expiresAt = DateHelpers.addMinutes(
          currentTime,
          this.configService.get('OTP_VALID_TIME_IN_MINUTES') as number,
        );

        otp = await this.otpRepository.create({
          otp: generatedOtp,
          phoneNumber: params.phoneNumber,
          expiresAt,
        }, db);

        // otp sending logic can be added here
        // if (!samplePhoneNumberUsed) {
        //   await this.whatsappOTPService.sendOTP(params.phoneNumber, generatedOtp);
        // }
        sent = true;
      }

      // Return or send the OTP as needed
      return { existing: !!account, secondsToExpiry, sent };
    })
  }

  async verifyOTP(
    params: VerifyOTPParamsDTO & { role: RoleNames; referralCode?: string },
  ): Promise<LoginResponseTypeDTO> {
    const currentTime = DateHelpers.getCurrentDate();
    const otpRecord = await this.otpRepository.findOne({
      phoneNumber: params.phoneNumber,
      otp: params.otp,
      expiresAt: { gt: currentTime },
    });

    if (!otpRecord) {
      throw new BadRequestException(ErrorMessages.invalidOrExpiredOTP);
    }

    // OTP is valid, delete it
    this.otpRepository.delete({ id: otpRecord.id });

    // Find or create user account
    let account = await this.userService.findOneByPhoneNumber(
      params.phoneNumber
    );
    if (params.referralCode && account) {
      throw new BadRequestException(
        'Referral code can not be used for existing account',
      );
    }
    if (params.referralCode && params.role === RoleNamesObj.CUSTOMER) {
      await this.customerService.checkReferralCode(params.referralCode);
    }
    const roleDetails = await this.roleService.getRoleByName(params.role);
    if (!roleDetails) throw new BadRequestException('Invalid role');
    // if verifying user is not customer
    // their account should have already present in system
    if (roleDetails.name !== RoleNamesObj.CUSTOMER && !account)
      throw new BadRequestException('No Account Found');
    let referralCode: string = '';
    if (account) {
      // checking role in request same as account role
      // for preventing request malforming
      if (roleDetails.id !== account.roleId)
        throw new BadRequestException('Please contact support.');
      const customer = await this.customerService.findCustomerByUserId(
        account.id,
      );
      referralCode = customer?.referralCode as string;
    } else {
      account = await this.userService.createAccount(
        roleDetails.id,
        params.phoneNumber,
      );
      if (roleDetails.name === RoleNamesObj.CUSTOMER) {
        // if user is customer, create customer account
        const customer = await this.customerService.createCustomer(
          account.id,
          params.referralCode,
        );
        referralCode = customer.referralCode;
      }
    }
    const sessionId = await this.sessionService.createSession(
      account.id,
      params.firebaseToken,
    );
    let driverId: string = ''
    const createdSession = await this.createSession(account, sessionId, referralCode);
    return {
      ...createdSession,
      driverId
    }
  }

  async updateProfile(userId: string, params: UpdateProfileParamsDTO) {
    return await this.userService.updateAccount(userId, params);
  }

  async refreshAccessToken(refreshBearerToken: string) {
    try {
      const decoded = this.jwtService.decode<{ id: string }>(
        refreshBearerToken,
      );
      if (!decoded.id) throw new ForbiddenException();
      const entry = await this.sessionService.validateRefreshToken(decoded.id);
      if (!entry || !entry.id) throw new ForbiddenException();
      await this.sessionService.deleteRefreshToken(entry.id);
      const sessionDetails = await this.sessionService.findOne(entry.sessionId);
      if (!sessionDetails) throw new ForbiddenException();
      return await this.generateTokens(sessionDetails.userId, sessionDetails.id);
    } catch (error) {
      this.logger.error(error.message);
      throw new ForbiddenException();
    }
  }

  async checkCustomerPhoneNumber(phoneNumber: string) {
    const account =
      await this.customerService.findCustomerByPhoneNumber(phoneNumber);

    return { success: !!account };
  }

  async checkReferralCode(referralCode: string) {
    await this.customerService.checkReferralCode(referralCode);
  }


  async deleteAccount(id: string) {
    return await this.userService.deleteAccount(id)
  }
}
