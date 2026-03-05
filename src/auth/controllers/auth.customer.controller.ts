import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LogRequest } from 'utils/logger/interceptors/log.interceptor';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import {
  CheckPhoneNumberDTO,
  CheckReferralCodeDTO,
  ProfileDTO,
  SendOTPResponseDTO,
  UpdateProfileParamsDTO,
} from '../dto/auth.dto';
import { SwaggerCustomer } from 'utils/decorators/SwaggerDoc';
import { ProtectRoute } from '../guards/auth.guard';
import { RequestWithUser } from '../types/request_with_user';
import { CurrentCustomer } from 'src/customers/decorators/current-customer';
import { Customer, UserSession } from '@prisma/client';
import { CurrentSession } from 'src/session/decorators/current-session';
import {
  CustomerProfileDTO,
  SendOTPCustomerParamsDTO,
  VerifyOTPCustomerParamsDTO,
} from '../dto/auth.customer.dto';
import { InvalidateRouteCache } from 'utils/cache/cache.invalidate.interceptor';
import { KeysForRevalidate } from '../cache/keys-for-revalidate';
import { NoCache } from 'utils/cache/cache.interceptor';

@Controller('/customer/auth')
@SwaggerCustomer('Auth')
export class CustomerAuthController {
  constructor(private readonly service: AuthService) { }

  @LogRequest()
  @Post('/send_otp')
  @ApiOkResponse({ type: SendOTPResponseDTO })
  async sendOTP(@Body() params: SendOTPCustomerParamsDTO) {
    return await this.service.sendOTP({ ...params, role: 'CUSTOMER' });
  }

  @LogRequest()
  @Post('/verify_otp')
  async verifyOTP(@Body() params: VerifyOTPCustomerParamsDTO) {
    try {
      return await this.service.verifyOTP({ ...params, role: 'CUSTOMER' });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @LogRequest()
  @Post('/refresh_token')
  @ApiHeader({
    name: 'x-refresh-token',
    required: true,
  })
  async refreshToken(@Headers('x-refresh-token') token: string) {
    if (!token) throw new ForbiddenException();
    token = token.split('Bearer ')[1];
    if (!token) throw new ForbiddenException();
    return await this.service.refreshAccessToken(token);
  }

  @LogRequest()
  @Post('/check_phone_number')
  @ApiOkResponse({ example: { success: true } })
  async checkPhoneNumber(
    @Body() params: CheckPhoneNumberDTO,
  ): Promise<{ success: boolean }> {
    return await this.service.checkCustomerPhoneNumber(params.phoneNumber);
  }

  @LogRequest()
  @Post('/check_referral_code')
  async checkReferralCode(@Body() params: CheckReferralCodeDTO) {
    await this.service.checkReferralCode(params.referralCode);
  }

  @ProtectRoute(['CUSTOMER'])
  @Get('profile')
  @ApiOkResponse({ type: ProfileDTO })
  @NoCache()
  async getProfile(
    @Req() req: RequestWithUser,
    @CurrentCustomer() customer: Customer,
  ): Promise<CustomerProfileDTO> {
    return {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      username: req.user.username,
      referralCode: customer.referralCode,
      unreadMsgs: 0
      // await this.service.getUnreadNotificationCount(req.user.id),
    };
  }

  @LogRequest()
  @ProtectRoute(['CUSTOMER'])
  @Post('/logout')
  @ApiOkResponse({ schema: { properties: { loggedOut: { type: 'boolean' } } } })
  async logout(@CurrentSession() session: UserSession) {
    return await this.service.logout(session.id)
  }

  @Post('/update_profile')
  @ProtectRoute(['CUSTOMER'])
  @InvalidateRouteCache(KeysForRevalidate)
  async updateProfile(
    @CurrentCustomer() customer: Customer,
    @Body() params: UpdateProfileParamsDTO,
  ) {
    return await this.service.updateProfile(customer.userId, params);
  }

  @Post('/delete_account')
  @ProtectRoute(['CUSTOMER'])
  @InvalidateRouteCache(KeysForRevalidate)
  async deleteAccount(@CurrentCustomer() customer: Customer) {
    return await this.service.deleteAccount(customer.userId)
  }
}
