import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  UseGuards,
  Get,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { EmailVerificationService } from '../services/email-verification.service';
import { PasswordResetService } from '../services/password-reset.service';
import { HtmlResponseService } from '../../common/services/html-response.service';
import {
  type UserWithoutPassword,
  User,
} from '../../users/entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('auth') // Ruta base es /api/auth
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly htmlResponseService: HtmlResponseService,
  ) {}

  // ✨ --- NUEVO ENDPOINT DE REGISTRO --- ✨
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
      secure: process.env.NODE_ENV === 'production', // Automático según entorno
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    // También devolver ambos tokens en el body (para React Native)
    return { message: 'Registro exitoso', user, accessToken, refreshToken };
  }

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
      httpOnly: true, // El frontend no puede leer esta cookie
      secure: process.env.NODE_ENV === 'production', // Automático según entorno
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    // También devolver ambos tokens en el body (para React Native)
    return { message: 'Login exitoso', user, accessToken, refreshToken };
  }
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

  @Get('user')
  @UseGuards(JwtAuthGuard)
  getUser(@GetUser() user: User): User {
    return user;
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.id, updateProfileDto);
  }

  // ✨ --- NUEVOS ENDPOINTS DE VERIFICACIÓN DE EMAIL --- ✨

  /**
   * Endpoint GET para verificar email desde el navegador
   * Este endpoint es llamado cuando el usuario hace clic en el enlace del email
   */
  @Get('verify-email')
  async verifyEmailFromBrowser(
    @Query('token') token: string,
    @Res() response: Response,
  ): Promise<void> {
    try {
      await this.emailVerificationService.verifyEmail(token);
      const successPage =
        this.htmlResponseService.getEmailVerificationSuccessPage();
      response.send(successPage);
    } catch (error) {
      const errorPage = this.htmlResponseService.getEmailVerificationErrorPage(
        error.message || 'No se pudo verificar tu email.',
      );
      response.status(400).send(errorPage);
    }
  }

  @Post('verify-email/:token')
  async verifyEmail(
    @Param('token') token: string,
  ): Promise<{ message: string; user: UserWithoutPassword }> {
    const user = await this.emailVerificationService.verifyEmail(token);
    return {
      message: 'Email verificado exitosamente',
      user,
    };
  }

  @Post('resend-verification')
  async resendVerificationEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.emailVerificationService.resendVerificationEmail(email);
    return {
      message:
        'Si el correo existe y no está verificado, se enviará un email de verificación',
    };
  }

  // ✨ --- ENDPOINTS DE RECUPERACIÓN DE CONTRASEÑA --- ✨

  /**
   * Solicitar recuperación de contraseña
   * POST /api/auth/forgot-password
   */
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 intentos por hora
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    console.log('🔔 [CONTROLLER] Endpoint /auth/forgot-password llamado');
    console.log('📧 [CONTROLLER] Email recibido:', forgotPasswordDto.email);

    try {
      await this.passwordResetService.requestPasswordReset(
        forgotPasswordDto.email,
      );
      console.log('✅ [CONTROLLER] Servicio ejecutado exitosamente');
      return {
        message:
          'Si el correo existe, recibirás un enlace para restablecer tu contraseña',
      };
    } catch (error) {
      console.error('❌ [CONTROLLER] Error en forgot-password:', error);
      throw error;
    }
  }

  /**
   * Validar token de recuperación
   * GET /api/auth/validate-reset-token/:token
   */
  @Get('validate-reset-token/:token')
  async validateResetToken(
    @Param('token') token: string,
  ): Promise<{ valid: boolean }> {
    const valid = await this.passwordResetService.validateResetToken(token);
    return { valid };
  }

  /**
   * Restablecer contraseña con token
   * POST /api/auth/reset-password
   */
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    // Validar que las contraseñas coincidan
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new UnauthorizedException('Las contraseñas no coinciden');
    }

    await this.passwordResetService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );

    return {
      message: 'Contraseña restablecida exitosamente',
    };
  }
}
