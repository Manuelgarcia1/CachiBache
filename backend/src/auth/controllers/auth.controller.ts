import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { type UserWithoutPassword } from '../../users/entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth') // Ruta base es /api/auth
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Configura una cookie de autenticación con el token JWT
   * @param response Objeto Response de Express
   * @param accessToken Token JWT a almacenar
   */
  private setCookieToken(response: Response, accessToken: string): void {
    response.cookie('accessToken', accessToken, {
      httpOnly: true, // El frontend no puede leer esta cookie
      secure: this.configService.get('NODE_ENV') === 'production', // HTTPS en producción
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });
  }

  // ✨ --- NUEVO ENDPOINT DE REGISTRO --- ✨
  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string; user: UserWithoutPassword }> {
    const { accessToken, user } =
      await this.authService.register(registerUserDto);

    this.setCookieToken(response, accessToken);

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

    this.setCookieToken(response, accessToken);

    return { message: 'Login exitoso', user };
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard) // 2. Proteger la ruta
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    // 3. Limpiar la cookie
    response.clearCookie('accessToken');
    return { message: 'Sesión cerrada exitosamente' };
  }

  // ✨ --- GOOGLE OAUTH (MOBILE) --- ✨

  /**
   * Endpoint para autenticación con Google desde MOBILE
   * Recibe un idToken de Google, lo valida y retorna un JWT
   */
  @Post('google/mobile')
  async googleMobileAuth(@Body() { idToken }: GoogleTokenDto): Promise<{
    message: string;
    accessToken: string;
    user: UserWithoutPassword;
  }> {
    const { user, accessToken } =
      await this.googleAuthService.authenticateWithGoogle(idToken);

    return {
      message: 'Autenticación con Google exitosa',
      accessToken,
      user,
    };
  }
}
