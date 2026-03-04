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
import { SwaggerStore } from 'utils/decorators/SwaggerDoc';
import { AuthService } from '../services/auth.service';
import { ProtectRoute } from '../guards/auth.guard';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import {
  ProfileDTO,
  SendOTPParamsDTO,
  SendOTPResponseDTO,
  VerifyOTPParamsDTO,
} from '../dto/auth.dto';
import { RequestWithUser } from '../types/request_with_user';
import { LogRequest } from 'utils/logger/interceptors/log.interceptor';
import { CurrentSession } from 'src/session/decorators/current-session';
import { UserSession } from '@prisma/client';

@SwaggerStore('Auth')
@Controller('/store/auth')
export class AuthStoreController {
  constructor(private readonly service: AuthService) {}

  @Get('profile')
  @ProtectRoute(['STORE_MANAGER'])
  @ApiOkResponse({ type: ProfileDTO })
  getProfile(@Req() req: RequestWithUser): ProfileDTO {
    return {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      email: req.user.email,
      unreadMsgs: 0
    };
  }

  @LogRequest()
  @Post('/send_otp')
  @ApiOkResponse({ type: SendOTPResponseDTO })
  async sendOTP(@Body() params: SendOTPParamsDTO) {
    return await this.service.sendOTP({ ...params, role: 'STORE_MANAGER' });
  }

  @LogRequest()
  @Post('/verify_otp')
  async verifyOTP(@Body() params: VerifyOTPParamsDTO) {
    try {
      return await this.service.verifyOTP({ ...params, role: 'STORE_MANAGER' });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @LogRequest()
  @ProtectRoute(['STORE_MANAGER'])
  @Post('/logout')
  @ApiOkResponse({ schema: { properties: { loggedOut: { type: 'boolean' } } } })
  async logout(@CurrentSession() session: UserSession) {
    return await this.service.logout(session.id);
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
}
