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
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { SwaggerAdmin } from 'utils/decorators/SwaggerDoc';
import { LogRequest } from 'utils/logger/interceptors/log.interceptor';
import {
  CheckPhoneNumberDTO,
  CheckReferralCodeDTO,
  LoginDto,
  LoginResponseTypeDTO,
  ProfileDTO,
  UpdateProfileParamsDTO
} from '../dto/auth.dto';
import { ProtectRoute } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';
import { RequestWithUser } from '../types/request_with_user';
import { CurrentSession } from 'src/session/decorators/current-session';
import { UserSession } from '@prisma/client';
import { InvalidateRouteCache } from 'utils/cache/cache.invalidate.interceptor';
import { KeysForRevalidate } from '../cache/keys-for-revalidate';

@SwaggerAdmin('Auth')
@Controller('/admin/auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @LogRequest()
  @Post('login')
  @ApiOkResponse({ type: LoginResponseTypeDTO })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseTypeDTO> {
    return await this.service.validateLogin(loginDto);
  }

  @ProtectRoute()
  @Get('profile')
  @ApiOkResponse({ type: ProfileDTO })
  getProfile(@Req() req: RequestWithUser): ProfileDTO {
    return {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      username: req.user.username,
      unreadMsgs: 0
    };
  }

  @LogRequest()
  @ProtectRoute()
  @InvalidateRouteCache(KeysForRevalidate)
  @Post('/update_profile')
  @ApiOkResponse({ type: ProfileDTO })
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() params: UpdateProfileParamsDTO,
  ) {
    await this.service.updateProfile(req.user.id, {
      username: params.username,
      firstName: params.firstName,
      lastName: params.lastName,
    });
    return { updated: true };
  }

  @LogRequest()
  @ProtectRoute(['ADMIN'])
  @Post('logout')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        loggedOut: {
          type: 'boolean',
        },
      },
    },
  })
  async logout(@CurrentSession() session: UserSession) {
    try {
      await this.service.logout(session.id);
      return { loggedOut: true };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @LogRequest()
  @Post('/refresh_token')
  @ApiHeader({
    name: 'x-refresh-token',
    required: true,
  })
  async refreshToken(@Headers('x-refresh-token') token: string) {
    if (!token) {
      throw new ForbiddenException();
    }
    token = token.split('Bearer ')[1];
    if (!token) {
      throw new ForbiddenException();
    }
    return await this.service.refreshAccessToken(token);
  }

  @LogRequest()
  @Post('/check_phone_number')
  @ApiOkResponse({ example: true })
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
}
