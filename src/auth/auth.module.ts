import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DatabaseModule } from 'utils/db/db.module';
import { PasswordService } from 'utils/passwords.service';
import { OTPRepository } from './repositories/otp.repository';
import { AuthController } from './controllers/auth.controller';
import { CustomerAuthController } from './controllers/auth.customer.controller';
import { AuthStoreController } from './controllers/Auth.store.controller';
import { DriverAuthService } from './services/auth.driver.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES },
    }),
  ],
  controllers: [
    AuthController,
    CustomerAuthController,
    AuthStoreController,
      ],
  providers: [
    Logger,
    AuthService,
    JwtStrategy,
    PasswordService,
    OTPRepository,
    DriverAuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
