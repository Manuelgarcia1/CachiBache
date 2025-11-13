import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThanOrEqual } from 'typeorm';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { User } from '@users/entities/user.entity';
import { EmailService } from '@common/services/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';
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
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();

    // Buscar usuario
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    // Por seguridad, no revelar si el email existe o no
    if (!user) {
      // Simular tiempo de procesamiento para evitar timing attacks
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }

    // Validar límite de intentos (3 en 24 horas)
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

    // Invalidar tokens anteriores del usuario
    await this.passwordResetTokenRepository.update(
      {
        userId: user.id,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      { isUsed: true },
    );

    // Generar código corto de 6 dígitos (más fácil de usar)
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Hashear el código antes de guardarlo (seguridad: nunca guardar en texto plano)
    const hashedToken = await bcrypt.hash(code, 10);

    // Calcular fecha de expiración (15 minutos)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Guardar token hasheado en base de datos
    const resetToken = this.passwordResetTokenRepository.create({
      token: hashedToken, // Se guarda el hash, no el código original
      userId: user.id,
      expiresAt,
      isUsed: false,
    });

    await this.passwordResetTokenRepository.save(resetToken);

    // Enviar email con el código sin hashear
    try {
      await this.emailService.sendPasswordResetEmail(user.email, code);
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw error;
    }
  }

  async validateResetToken(token: string): Promise<boolean> {
    // Obtener todos los tokens válidos no usados y no expirados
    const validTokens = await this.passwordResetTokenRepository.find({
      where: {
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    // Comparar el código ingresado con cada token hasheado
    for (const resetToken of validTokens) {
      const isMatch = await bcrypt.compare(token, resetToken.token);
      if (isMatch) {
        return true;
      }
    }

    return false;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Obtener todos los tokens válidos no usados y no expirados
    const validTokens = await this.passwordResetTokenRepository.find({
      where: {
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    // Buscar el token que coincida con el código ingresado
    let matchedToken: PasswordResetToken | null = null;
    for (const resetToken of validTokens) {
      const isMatch = await bcrypt.compare(token, resetToken.token);
      if (isMatch) {
        matchedToken = resetToken;
        break;
      }
    }

    if (!matchedToken) {
      throw new BadRequestException(
        'El código de recuperación es inválido o ha expirado',
      );
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña del usuario
    await this.userRepository.update(matchedToken.userId, {
      password: hashedPassword,
    });

    // Marcar token como usado
    matchedToken.isUsed = true;
    await this.passwordResetTokenRepository.save(matchedToken);
  }

  /**
   * Limpieza automática de tokens usados o expirados
   * Se ejecuta cada hora para mantener la DB limpia
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredTokens(): Promise<void> {
    try {
      // Eliminar tokens que estén usados O expirados
      const result = await this.passwordResetTokenRepository.delete({
        isUsed: true,
      });

      const expiredResult = await this.passwordResetTokenRepository.delete({
        expiresAt: LessThanOrEqual(new Date()),
      });
    } catch (error) {
      console.error('❌ Error durante la limpieza de tokens:', error);
    }
  }
}
