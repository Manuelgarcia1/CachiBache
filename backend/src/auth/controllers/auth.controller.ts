import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { type UserWithoutPassword } from '../../users/entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth') // Ruta base es /api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✨ --- NUEVO ENDPOINT DE REGISTRO --- ✨
  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string; user: UserWithoutPassword }> {
    const { accessToken, user } =
      await this.authService.register(registerUserDto);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    return { message: 'Registro exitoso', user };
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string; user: UserWithoutPassword }> {
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { accessToken } = this.authService.login(user);

    response.cookie('accessToken', accessToken, {
      httpOnly: true, // El frontend no puede leer esta cookie
      secure: false, // En producción debería ser true (solo HTTPS)
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    return { message: 'Login exitoso', user };
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie('accessToken');
    return { message: 'Sesión cerrada exitosamente' };
  }
}
