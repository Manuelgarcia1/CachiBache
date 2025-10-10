import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from '../services/auth.service';
import { type UserWithoutPassword } from '../../users/entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { type GoogleProfile } from '../strategies/google.strategy';

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
  @UseGuards(JwtAuthGuard) // 2. Proteger la ruta
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    // 3. Limpiar la cookie
    response.clearCookie('accessToken');
    return { message: 'Sesión cerrada exitosamente' };
  }

  // ✨ --- ENDPOINTS DE GOOGLE OAUTH --- ✨

  // Inicia el flujo de autenticación con Google
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(): Promise<void> {
    // El guard redirige automáticamente a Google
  }

  // Callback de Google después de la autenticación
  @Get('google-callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string; user: UserWithoutPassword }> {
    const googleProfile = req.user as GoogleProfile;

    // Validar y crear/obtener usuario
    const user = await this.authService.validateGoogleUser(googleProfile);

    // Generar JWT
    const { accessToken } = this.authService.login(user);

    // Configurar cookie
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // En producción debería ser true
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    return { message: 'Autenticación con Google exitosa', user };
  }
}
