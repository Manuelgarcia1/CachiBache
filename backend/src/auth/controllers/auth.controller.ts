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
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from '../services/auth.service';
import { type UserWithoutPassword } from '../../users/entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { type GoogleProfile } from '../strategies/google.strategy';

@Controller('auth') // Ruta base es /api/auth
export class AuthController {
  private googleClient: OAuth2Client;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    // Inicializar cliente de Google para validar tokens de mobile
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

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

  // Endpoint para autenticación con Google desde MOBILE
  @Post('google/mobile')
  async googleMobileAuth(@Body() googleTokenDto: GoogleTokenDto): Promise<{
    message: string;
    accessToken: string;
    user: UserWithoutPassword;
  }> {
    try {
      // Validar el idToken con Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleTokenDto.idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Token de Google inválido');
      }

      // Construir perfil de Google
      const googleProfile: GoogleProfile = {
        id: payload.sub,
        email: payload.email || '',
        fullName: payload.name || '',
        avatarUrl: payload.picture || '',
      };

      // Validar y crear/obtener usuario
      const user = await this.authService.validateGoogleUser(googleProfile);

      // Generar JWT
      const { accessToken } = this.authService.login(user);

      // Retornar JSON (NO cookies para mobile)
      return {
        message: 'Autenticación con Google exitosa',
        accessToken,
        user,
      };
    } catch (error) {
      console.error('Error en autenticación con Google mobile:', error);
      throw new UnauthorizedException('No se pudo validar el token de Google');
    }
  }

  // Inicia el flujo de autenticación con Google (WEB)
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
