import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class DriverAuthService {
  constructor(private readonly authService: AuthService) {}

  async updateProfile(userId: string, params: any) {
    return await this.authService.updateProfile(userId, params);
  }
}
