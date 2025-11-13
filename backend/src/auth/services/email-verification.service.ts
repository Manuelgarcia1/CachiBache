import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { EmailVerificationToken } from '../entities/email-verification-token.entity';
import { EmailService } from '@common/services/email.service';
import { UsersService } from '@users/services/users.service';
import { type UserWithoutPassword } from '@users/entities/user.entity';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Crea un token de verificación de email para un usuario
   * @param userId - ID del usuario
   * @returns Token generado
   */
  async createEmailVerificationToken(userId: string): Promise<string> {
    // Generar token aleatorio
    const token = crypto.randomBytes(32).toString('hex');

    // Calcular fecha de expiración (24 horas)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Guardar token en la base de datos
    const verificationToken = this.emailVerificationTokenRepository.create({
      token,
      userId,
      expiresAt,
      isUsed: false,
    });

    await this.emailVerificationTokenRepository.save(verificationToken);

    return token;
  }

  /**
   * Verifica el email de un usuario usando un token
   * @param token - Token de verificación
   * @returns Usuario con email verificado
   */
  async verifyEmail(token: string): Promise<UserWithoutPassword> {
    // Buscar el token en la base de datos
    const verificationToken =
      await this.emailVerificationTokenRepository.findOne({
        where: { token },
        relations: ['user'],
      });

    if (!verificationToken) {
      throw new NotFoundException('Token de verificación no válido');
    }

    // Verificar si el token ya fue usado
    if (verificationToken.isUsed) {
      throw new BadRequestException('Este token ya ha sido utilizado');
    }

    // Verificar si el token expiró
    if (new Date() > verificationToken.expiresAt) {
      throw new BadRequestException('El token de verificación ha expirado');
    }

    // Marcar el token como usado
    verificationToken.isUsed = true;
    await this.emailVerificationTokenRepository.save(verificationToken);

    // Actualizar el usuario para marcar el email como verificado
    const user = verificationToken.user;
    user.emailVerified = true;
    await this.usersService.updateProfile(user.id, { emailVerified: true });

    // Retornar el usuario sin la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Reenvía el email de verificación a un usuario
   * @param email - Email del usuario
   */
  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      // No revelar si el email existe o no
      return;
    }

    if (user.emailVerified) {
      throw new BadRequestException('El email ya está verificado');
    }

    // Crear nuevo token y enviar email
    const token = await this.createEmailVerificationToken(user.id);
    await this.emailService.sendVerificationEmail(user.email, token);
  }

  /**
   * Envía email de verificación a un usuario recién registrado
   * @param userId - ID del usuario
   * @param email - Email del usuario
   */
  async sendVerificationEmailToNewUser(
    userId: string,
    email: string,
  ): Promise<void> {
    const token = await this.createEmailVerificationToken(userId);
    await this.emailService.sendVerificationEmail(email, token);
  }
}
