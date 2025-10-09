import { Controller, Post, Body, Res, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { accessToken } = await this.authService.login(user);

    response.cookie('accessToken', accessToken, {
      httpOnly: true, // El frontend no puede leer esta cookie
      secure: false, // En producción debería ser true (solo HTTPS)
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    return { message: 'Login exitoso', user };
  }
}