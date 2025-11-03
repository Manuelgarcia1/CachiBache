import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // --- 👇 ¡LA CORRECCIÓN ESTÁ AQUÍ! 👇 ---
    const smtpPort = this.configService.get<number>('SMTP_PORT');

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: smtpPort,
      // La opción 'secure' debe ser dinámica:
      // true si el puerto es 465, false en caso contrario.
      secure: smtpPort === 465,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      // Añadimos un timeout para que no se quede colgado indefinidamente
      connectionTimeout: 10000, // 10 segundos
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    // Usar la URL del backend para manejar la verificación
    const backendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    const verificationUrl = `${backendUrl}/api/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: `"CachiBache" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Verifica tu correo electrónico - CachiBache',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Bienvenido a CachiBache!</h2>
          <p>Gracias por registrarte. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}"
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verificar Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
          <p style="color: #007bff; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">Este enlace expirará en 24 horas.</p>
          <p style="color: #999; font-size: 12px;">Si no creaste una cuenta en CachiBache, puedes ignorar este correo.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"CachiBache" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Recuperación de contraseña - CachiBache',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperación de contraseña</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
          <p style="color: #007bff; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">Este enlace expirará en 1 hora.</p>
          <p style="color: #999; font-size: 12px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
        </div>
      `,
    });
  }
}
