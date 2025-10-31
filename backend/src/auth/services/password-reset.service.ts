import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { UsersService } from '../../users/services/users.service';
import { EmailService } from '../../common/services/email.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly encryptionService: EncryptionService,
  ) {}

  /**
   * Genera un token de reseteo y envía un email al usuario.
   * @param email - El email del usuario que solicita el reseteo.
   */
  async sendForgotPasswordEmail(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.usersService.findOneByEmail(normalizedEmail);

    // Para no revelar si un email existe o no, siempre devolvemos un mensaje genérico.
    if (!user) {
      return {
        message:
          'Si tu correo electrónico está en nuestros registros, recibirás un enlace para restablecer tu contraseña.',
      };
    }

    // Generar un token seguro
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora de expiración

    // Guardar el token en la base de datos
    const resetToken = this.passwordResetTokenRepository.create({
      token,
      userId: user.id,
      expiresAt,
    });
    await this.passwordResetTokenRepository.save(resetToken);

    // Construir el deep link para la app móvil
    const deepLink = `cachibache://reset-password?token=${token}`;

    // Enviar el email
    try {
      await this.emailService.sendPasswordResetDeepLinkEmail(
        user.email,
        deepLink,
      );
    } catch (error) {
      console.error('Error al enviar email de reseteo:', error);
      throw new InternalServerErrorException(
        'No se pudo enviar el email de recuperación.',
      );
    }

    return {
      message:
        'Si tu correo electrónico está en nuestros registros, recibirás un enlace para restablecer tu contraseña.',
    };
  }

  /**
   * Resetea la contraseña del usuario usando el token.
   * @param resetPasswordDto - DTO con el token y la nueva contraseña.
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, password, passwordConfirmation } = resetPasswordDto;

    if (password !== passwordConfirmation) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (
      !resetToken ||
      resetToken.isUsed ||
      resetToken.expiresAt < new Date()
    ) {
      throw new BadRequestException('El token no es válido o ha expirado.');
    }

    // Marcar el token como usado
    resetToken.isUsed = true;
    await this.passwordResetTokenRepository.save(resetToken);

    // Actualizar la contraseña del usuario
    const hashedPassword = await this.encryptionService.hashPassword(password);
    await this.usersService.updatePassword(
      resetToken.userId,
      hashedPassword,
    );

    return { message: 'Contraseña actualizada exitosamente.' };
  }
}
