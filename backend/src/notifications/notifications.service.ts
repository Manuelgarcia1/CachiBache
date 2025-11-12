import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { PushToken } from './entities/push-token.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private expo: Expo;

  constructor(
    @InjectRepository(PushToken)
    private pushTokenRepository: Repository<PushToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.expo = new Expo();
  }

  /**
   * Registra un token de notificaciones push para un usuario
   */
  async registerToken(
    userId: string,
    token: string,
    deviceType?: string,
  ): Promise<PushToken> {
    this.logger.log(`Registrando token para usuario ${userId}`);

    // Validar que el token sea válido para Expo
    if (!Expo.isExpoPushToken(token)) {
      throw new Error('Token inválido: no es un token válido de Expo Push');
    }

    // Buscar el usuario
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el token ya existe
    let pushToken = await this.pushTokenRepository.findOne({
      where: { token },
      relations: ['user'], // ✅ Cargar relación para comparar usuario
    });

    if (pushToken) {
      // Siempre actualizar el token existente para asegurar la relación con el usuario
      let needsUpdate = false;

      // Si está inactivo, reactivarlo
      if (!pushToken.isActive) {
        pushToken.isActive = true;
        needsUpdate = true;
        this.logger.log(`Token reactivado: ${token}`);
      }

      // Actualizar usuario (puede haber cambiado si el token se reutilizó)
      if (!pushToken.user || pushToken.user.id !== userId) {
        pushToken.user = user;
        needsUpdate = true;
        this.logger.log(`Actualizando usuario para token: ${token}`);
      }

      // Actualizar tipo de dispositivo si se proporciona
      if (deviceType && pushToken.deviceType !== deviceType) {
        pushToken.deviceType = deviceType;
        needsUpdate = true;
      }

      // Guardar cambios si hubo alguna actualización
      if (needsUpdate) {
        await this.pushTokenRepository.save(pushToken);
        this.logger.log(`Token actualizado en BD: ${token}`);
      } else {
        this.logger.log(`Token ya existía y estaba activo: ${token}`);
      }

      return pushToken;
    }

    // Crear nuevo token
    pushToken = this.pushTokenRepository.create({
      token,
      user,
      deviceType,
      isActive: true,
    });

    await this.pushTokenRepository.save(pushToken);
    this.logger.log(`Token registrado exitosamente: ${token}`);

    return pushToken;
  }

  /**
   * Desregistra un token de notificaciones push
   */
  async unregisterToken(userId: string, token: string): Promise<void> {
    this.logger.log(`Desregistrando token ${token} para usuario ${userId}`);

    const pushToken = await this.pushTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (pushToken && pushToken.user.id === userId) {
      pushToken.isActive = false;
      await this.pushTokenRepository.save(pushToken);
      this.logger.log(`Token desregistrado: ${token}`);
    } else {
      this.logger.warn(
        `Token no encontrado o no pertenece al usuario: ${token}`,
      );
    }
  }

  /**
   * Envía notificación de cambio de estado de reporte
   */
  async sendReportStatusUpdate(
    userId: string,
    reportId: string,
    newStatus: string,
  ): Promise<void> {
    this.logger.log(
      `Enviando notificación a usuario ${userId} sobre reporte ${reportId}`,
    );

    try {
      // Obtener todos los tokens activos del usuario
      const tokens = await this.pushTokenRepository.find({
        where: { user: { id: userId }, isActive: true },
        relations: ['user'], // ✅ Cargar relación explícitamente
      });

      this.logger.log(
        `Tokens encontrados para usuario ${userId}: ${tokens.length}`,
      );

      if (tokens.length === 0) {
        this.logger.warn(
          `No se encontraron tokens activos para usuario ${userId}`,
        );
        return;
      }

      // Crear mensajes para Expo
      const messages: ExpoPushMessage[] = tokens.map((tokenRecord) => ({
        to: tokenRecord.token,
        sound: 'default',
        title: '¡Actualización de tu reporte! 🚧',
        body: `Tu reporte de bache ahora está: ${this.translateStatus(newStatus)}`,
        data: { reportId, status: newStatus },
        priority: 'high',
      }));

      // Enviar notificaciones en chunks (Expo recomienda max 100 por request)
      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets: ExpoPushTicket[] = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          this.logger.error(
            `Error enviando chunk de notificaciones: ${error.message}`,
          );
        }
      }

      // Procesar tickets y desactivar tokens con errores
      await this.processTickets(tickets, tokens);

      this.logger.log(
        `Notificaciones enviadas exitosamente a ${tokens.length} dispositivo(s)`,
      );
    } catch (error) {
      this.logger.error(
        `Error enviando notificación de reporte: ${error.message}`,
        error.stack,
      );
      // No lanzamos el error para que no afecte la actualización del reporte
    }
  }

  /**
   * Procesa los tickets de Expo y desactiva tokens con errores
   */
  private async processTickets(
    tickets: ExpoPushTicket[],
    tokens: PushToken[],
  ): Promise<void> {
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];

      if (ticket.status === 'error') {
        this.logger.error(
          `Error en ticket ${i}: ${ticket.message}`,
          ticket.details,
        );

        // Si el error es DeviceNotRegistered, desactivar el token
        if (
          ticket.details?.error === 'DeviceNotRegistered' ||
          ticket.details?.error === 'InvalidCredentials'
        ) {
          const token = tokens[i];
          if (token) {
            this.logger.warn(`Desactivando token inválido: ${token.token}`);
            token.isActive = false;
            await this.pushTokenRepository.save(token);
          }
        }
      }
    }
  }

  /**
   * Traduce el estado del reporte a español legible
   */
  private translateStatus(status: string): string {
    const translations: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      EN_REPARACION: 'En Reparación',
      RESUELTO: 'Resuelto',
      DESCARTADO: 'Descartado',
      // Legacy support (por si acaso)
      pending: 'Pendiente',
      'in-progress': 'En Reparación',
      resolved: 'Resuelto',
      rejected: 'Descartado',
    };
    return translations[status] || status;
  }

  /**
   * Limpia tokens inactivos antiguos (puede ejecutarse como cron job)
   */
  async cleanupInactiveTokens(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.pushTokenRepository
      .createQueryBuilder()
      .delete()
      .where('is_active = :isActive', { isActive: false })
      .andWhere('updated_at < :cutoffDate', { cutoffDate })
      .execute();

    this.logger.log(`Eliminados ${result.affected} tokens inactivos antiguos`);
    return result.affected || 0;
  }
}
