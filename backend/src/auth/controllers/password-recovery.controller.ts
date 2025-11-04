import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PasswordResetService } from '../services/password-reset.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Controller('auth')
export class PasswordRecoveryController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  /**
   * POST /auth/forgot-password
   * Solicitar recuperación de contraseña
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
   * GET /auth/validate-reset-token/:token
   * Validar token de recuperación
   */
  @Get('validate-reset-token/:token')
  async validateResetToken(
    @Param('token') token: string,
  ): Promise<{ valid: boolean }> {
    const valid = await this.passwordResetService.validateResetToken(token);
    return { valid };
  }

  /**
   * POST /auth/reset-password
   * Restablecer contraseña con token
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
