import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../entities/refresh-token.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Crea un nuevo refresh token para un usuario
   * @param userId - ID del usuario
   * @returns RefreshToken entity con el token generado
   */
  async createRefreshToken(userId: string): Promise<RefreshToken> {
    // Generar token único y seguro (64 bytes = 128 caracteres hex)
    const token = this.generateSecureToken();

    // Calcular fecha de expiración desde las variables de entorno
    const expiresIn =
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '30d';
    const expiresAt = this.calculateExpirationDate(expiresIn);

    // Crear y guardar el refresh token en la base de datos
    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
      isRevoked: false,
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }

  /**
   * Valida un refresh token
   * @param token - Token a validar
   * @returns RefreshToken entity si es válido
   * @throws UnauthorizedException si el token es inválido, expirado o revocado
   */
  async validateRefreshToken(token: string): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Token de refresco inválido');
    }

    if (refreshToken.isRevoked) {
      throw new UnauthorizedException(
        'Token de refresco revocado. Por favor, inicia sesión nuevamente.',
      );
    }

    if (refreshToken.isExpired()) {
      throw new UnauthorizedException(
        'Token de refresco expirado. Por favor, inicia sesión nuevamente.',
      );
    }

    return refreshToken;
  }

  /**
   * Revoca un refresh token específico
   * @param token - Token a revocar
   */
  async revokeToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update({ token }, { isRevoked: true });
  }

  /**
   * Revoca todos los refresh tokens de un usuario
   * Útil para cerrar sesión en todos los dispositivos
   * @param userId - ID del usuario
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    // ELIMINAR todos los tokens anteriores en lugar de solo revocarlos
    // Esto mantiene la tabla limpia y asegura una sola sesión activa
    await this.refreshTokenRepository.delete({ userId });
  }

  /**
   * Elimina tokens expirados de la base de datos (limpieza)
   * Se puede llamar periódicamente mediante un cron job
   */
  async cleanExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now })
      .execute();
  }

  /**
   * Genera un token seguro y único usando crypto
   * @returns Token string en formato hexadecimal
   */
  private generateSecureToken(): string {
    return randomBytes(64).toString('hex');
  }

  /**
   * Calcula la fecha de expiración basada en un string de tiempo
   * @param expiresIn - String como "30d", "7d", "24h", etc.
   * @returns Date de expiración
   */
  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);

    if (!match) {
      throw new Error(
        `Formato de expiración inválido: ${expiresIn}. Use formato como "30d", "7d", "24h"`,
      );
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': // segundos
        now.setSeconds(now.getSeconds() + value);
        break;
      case 'm': // minutos
        now.setMinutes(now.getMinutes() + value);
        break;
      case 'h': // horas
        now.setHours(now.getHours() + value);
        break;
      case 'd': // días
        now.setDate(now.getDate() + value);
        break;
      default:
        throw new Error(`Unidad de tiempo no soportada: ${unit}`);
    }

    return now;
  }
}
