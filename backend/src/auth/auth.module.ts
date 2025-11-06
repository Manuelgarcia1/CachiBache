import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/google-auth.service';
import { EmailVerificationService } from './services/email-verification.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { PasswordResetService } from './services/password-reset.service';
import { AuthController } from './controllers/auth.controller';
import { EmailVerificationController } from './controllers/email-verification.controller';
import { PasswordRecoveryController } from './controllers/password-recovery.controller';
import { UsersModule } from '@users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CommonModule } from '@common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { User } from '@users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailVerificationToken,
      RefreshToken,
      PasswordResetToken,
      User,
    ]),
    UsersModule,
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    EmailVerificationController,
    PasswordRecoveryController,
  ],
  providers: [
    AuthService,
    GoogleAuthService,
    EmailVerificationService,
    RefreshTokenService,
    PasswordResetService,
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
