import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { User } from '../../users/entities/user.entity';
import { EmailService } from '../../common/services/email.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    console.log('🔐 Solicitud de recuperación de contraseña para:', email);

    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();

    // Buscar usuario
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    // Por seguridad, no revelar si el email existe o no
    if (!user) {
      console.log(
        '⚠️ Usuario no encontrado, simulando respuesta por seguridad',
      );
      // Simular tiempo de procesamiento para evitar timing attacks
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }

    console.log('✅ Usuario encontrado:', user.email);

    // Validar límite de intentos (3 en 24 horas) - DESHABILITADO PARA TESTING
    /*
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentAttempts = await this.passwordResetTokenRepository.count({
      where: {
        userId: user.id,
        createdAt: MoreThan(twentyFourHoursAgo),
      },
    });

    if (recentAttempts >= 3) {
      throw new BadRequestException(
        'Has excedido el límite de intentos. Por favor, intenta de nuevo en 24 horas.',
      );
    }
    */
    console.log('⚠️ Límite de intentos deshabilitado para testing');

    // Invalidar tokens anteriores del usuario
    await this.passwordResetTokenRepository.update(
      {
        userId: user.id,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      { isUsed: true },
    );

    // Generar token aleatorio
    const token = crypto.randomBytes(32).toString('hex');

    // Calcular fecha de expiración (15 minutos)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Guardar token en base de datos
    const resetToken = this.passwordResetTokenRepository.create({
      token,
      userId: user.id,
      expiresAt,
      isUsed: false,
    });

    await this.passwordResetTokenRepository.save(resetToken);
    console.log('💾 Token guardado en base de datos');

    // Enviar email
    console.log('📧 Enviando email de recuperación...');
    try {
      await this.emailService.sendPasswordResetEmail(user.email, token);
      console.log('✅ Email enviado exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw error;
    }
  }

  async validateResetToken(token: string): Promise<boolean> {
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    return !!resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Buscar token válido
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    if (!resetToken) {
      throw new BadRequestException(
        'El token de recuperación es inválido o ha expirado',
      );
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña del usuario
    await this.userRepository.update(resetToken.userId, {
      password: hashedPassword,
    });

    // Marcar token como usado
    resetToken.isUsed = true;
    await this.passwordResetTokenRepository.save(resetToken);
  }
}
