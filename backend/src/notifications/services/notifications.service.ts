import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushToken } from '../entities/push-token.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(PushToken)
    private pushTokenRepository: Repository<PushToken>,
  ) {}

  async registerPushToken(userId: string, token: string): Promise<void> {
    const existing = await this.pushTokenRepository.findOne({
      where: { user: { id: userId }, token }
    });

    if (!existing) {
      const pushToken = this.pushTokenRepository.create({
        token,
        user: { id: userId }
      });
      await this.pushTokenRepository.save(pushToken);
    }
  }

  async sendReportStatusNotification(userId: string, reportId: number, newStatus: string): Promise<void> {
    console.log(`Iniciando envio de notificacion para usuario ${userId}, reporte ${reportId}, estado: ${newStatus}`);
    
    const tokens = await this.pushTokenRepository.find({
      where: { user: { id: userId } }
    });

    console.log(`Encontrados ${tokens.length} tokens para el usuario ${userId}`);

    for (const tokenRecord of tokens) {
      try {
        const message = {
          to: tokenRecord.token,
          sound: 'default',
          title: 'Estado de reporte actualizado',
          body: `Tu reporte #${reportId} ahora esta: ${newStatus}`,
          data: { reportId }
        };

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });

        console.log(`Notificacion enviada a usuario ${userId} para reporte ${reportId}`);
      } catch (error) {
        console.error('Error enviando notificacion:', error);
      }
    }
  }
}