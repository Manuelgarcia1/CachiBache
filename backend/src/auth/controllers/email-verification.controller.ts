import { Controller, Get, Post, Param, Query, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { EmailVerificationService } from '../services/email-verification.service';
import { HtmlResponseService } from '@common/services/html-response.service';
import { type UserWithoutPassword } from '@users/entities/user.entity';

@Controller('auth')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
    private readonly htmlResponseService: HtmlResponseService,
  ) {}

  /**
   * GET /auth/verify-email?token=xxx
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

  /**
   * POST /auth/verify-email/:token
   * Verificar email desde la app móvil (retorna JSON)
   */
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

  /**
   * POST /auth/resend-verification
   * Reenviar email de verificación
   */
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
}
