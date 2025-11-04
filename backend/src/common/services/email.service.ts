import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: false, // true para puerto 465, false para otros puertos
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
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
    await this.transporter.sendMail({
      from: `"CachiBache" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Recuperación de contraseña - CachiBache',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperación de contraseña</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>

          <p style="margin-top: 20px;"><strong>Sigue estos pasos:</strong></p>
          <ol style="line-height: 1.8;">
            <li>Abre la aplicación CachiBache en tu dispositivo</li>
            <li>Ve a la pantalla de "Olvidé mi contraseña"</li>
            <li>Toca el botón "Ya tengo un código"</li>
            <li>Copia y pega el siguiente código:</li>
          </ol>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Tu código de recuperación:</p>
            <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #007bff; letter-spacing: 2px; margin: 0; word-break: break-all;">
              ${token}
            </p>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">⏰ Este código expirará en 15 minutos.</p>
          <p style="color: #999; font-size: 12px;">🔒 Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.</p>
        </div>
      `,
    });
  }
}
