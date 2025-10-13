import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/google-auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module'; // 1. Importar UsersModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    UsersModule, // Para poder usar UsersService
    CommonModule, // Para usar EncryptionService
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
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService, JwtStrategy], // Registrar servicios y estrategias
  exports: [JwtStrategy, PassportModule], // Exportar para usar en otros módulos
})
export class AuthModule {}
