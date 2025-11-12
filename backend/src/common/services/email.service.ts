// backend/src/common/services/email.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private isConfigured: boolean = false; // <-- 1. Usaremos una bandera para saber si está configurado

  private emailFrom = 'CachiBache <noreply@concordiaconecta.com>';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.isConfigured = true; // <-- 2. Marcamos que la configuración es correcta
    } else {
      this.logger.warn(
        'RESEND_API_KEY no está configurada. El servicio de email está deshabilitado.',
      );
    }
  }

  /**
   * Envía el email de verificación de cuenta.
   * @param email Email del destinatario.
   * @param token Token de verificación.
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const backendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationUrl = `${backendUrl}/api/auth/verify-email?token=${token}`;

    const subject = 'Verifica tu correo electrónico - CachiBache';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px 40px; border-radius: 8px; text-align: center;">
        <h2 style="color: #094b7eff;">¡Bienvenido a CachiBache!</h2>
        <p style="color: #333; font-size: 16px;">Gracias por registrarte. Para activar tu cuenta, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
        
        <!-- Botón HTML basado en tablas para máxima compatibilidad -->
        <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
          <tr>
            <td align="center" style="border-radius: 8px; background-color: #FACC15;">
              <a href="${verificationUrl}" target="_blank" style="font-size: 16px; font-weight: bold; color: #111827; text-decoration: none; border-radius: 8px; padding: 14px 28px; border: 1px solid #FACC15; display: inline-block;">
                Verificar Email
              </a>
            </td>
          </tr>
        </table>
        
        <p style="color: #666; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="color: #007bff; word-break: break-all; font-size: 12px;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Este enlace expirará en 24 horas.</p>
      </div>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Envía el email para restablecer la contraseña.
   * @param email Email del destinatario.
   * @param token Código de verificación de 6 dígitos.
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const subject = 'Recuperación de contraseña - CachiBache';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px 40px; border-radius: 8px; text-align: center;">
        <h2 style="color: #094b7eff;">Recuperación de contraseña</h2>
        <p style="color: #333; font-size: 16px;">Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código de verificación en la aplicación:</p>

        <!-- Código de verificación destacado -->
        <div style="background-color: #f8f9fa; border: 2px dashed #094b7eff; border-radius: 8px; padding: 20px; margin: 30px auto; max-width: 300px;">
          <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">Tu código de verificación:</p>
          <p style="font-size: 32px; font-weight: bold; color: #094b7eff; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${token}</p>
        </div>

        <p style="color: #666; font-size: 14px;">Ingresa este código en la aplicación para continuar con el restablecimiento de tu contraseña.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Este código expirará en 15 minutos.</p>
        <p style="color: #999; font-size: 12px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
      </div>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Método privado genérico para enviar emails usando Resend.
   */
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    // --- 👇 ¡AQUÍ ESTÁ LA CORRECCIÓN! 👇 ---
    // 3. Verificamos nuestra bandera 'isConfigured' en lugar de una propiedad inexistente
    if (!this.isConfigured) {
      this.logger.error(
        `Intento de envío de email a ${to} fallido: El servicio de email no está configurado (falta RESEND_API_KEY).`,
      );
      // Es importante no lanzar un error aquí para que el flujo de registro/login no se interrumpa,
      // solo se registrará el fallo en los logs.
      return;
    }

    try {
      this.logger.log(
        `Enviando email a ${to} con asunto "${subject}" vía Resend...`,
      );
      const { data, error } = await this.resend.emails.send({
        from: this.emailFrom,
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        this.logger.error(
          `Error devuelto por la API de Resend para ${to}`,
          error,
        );
        throw new Error(`Resend API Error: ${error.message}`);
      }

      this.logger.log(
        `Email enviado exitosamente a ${to}. ID de Resend: ${data.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Fallo catastrófico al intentar enviar email a ${to}`,
        error.stack,
      );
      throw error;
    }
  }
}
