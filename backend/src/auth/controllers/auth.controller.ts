import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { type UserWithoutPassword, User } from '@users/entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

/**
 * AuthController
 * Maneja únicamente la autenticación y gestión de sesiones:
 * - Registro de nuevos usuarios
 * - Inicio de sesión
 * - Cierre de sesión (uno o todos los dispositivos)
 * - Renovación de tokens
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Registrar un nuevo usuario
   */
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 registros por hora
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    message: string;
    user: UserWithoutPassword;
    accessToken: string;
    refreshToken: string;
  }> {
    const { accessToken, refreshToken, user } =
      await this.authService.register(registerUserDto);

    // Enviar access token en cookie httpOnly (para seguridad web)
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    // También devolver ambos tokens en el body (para React Native)
    return { message: 'Registro exitoso', user, accessToken, refreshToken };
  }

  /**
   * POST /auth/login
   * Iniciar sesión
   */
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    message: string;
    user: UserWithoutPassword;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { accessToken, refreshToken } = await this.authService.login(user);

    // Enviar access token en cookie httpOnly (para seguridad web)
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    // También devolver ambos tokens en el body (para React Native)
    return { message: 'Login exitoso', user, accessToken, refreshToken };
  }

  /**
   * POST /auth/logout
   * Cerrar sesión en el dispositivo actual
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Body('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    // Revocar el refresh token si se proporciona
    if (refreshToken) {
      try {
        await this.authService.revokeRefreshToken(refreshToken);
      } catch (error) {
        // Si falla la revocación, no importa, el usuario quiere salir igual
        console.error('Error revocando refresh token:', error);
      }
    }

    // Limpiar cookie de access token
    response.clearCookie('accessToken');
    return { message: 'Sesión cerrada exitosamente' };
  }

  /**
   * POST /auth/logout-all
   * Cerrar sesión en todos los dispositivos
   */
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    // Revocar TODOS los refresh tokens del usuario
    await this.authService.revokeAllRefreshTokens(user.id);

    // Limpiar cookie de access token
    response.clearCookie('accessToken');
    return { message: 'Sesión cerrada en todos los dispositivos' };
  }

  /**
   * POST /auth/refresh
   * Renovar access token usando refresh token
   */
  @Post('refresh')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requerido');
    }

    try {
      const result = await this.authService.refreshAccessToken(refreshToken);
      console.log(
        '✅ [BACKEND] REFRESH TOKEN: Sesión renovada automáticamente',
      );
      return result;
    } catch (error) {
      console.error('❌ [BACKEND] REFRESH TOKEN: Error -', error.message);
      throw error;
    }
  }
}
