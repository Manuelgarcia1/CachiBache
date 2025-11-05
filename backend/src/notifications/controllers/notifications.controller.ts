import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@users/entities/user.entity';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('register-token')
  async registerPushToken(
    @GetUser() user: User,
    @Body() body: { token: string }
  ) {
    await this.notificationsService.registerPushToken(user.id, body.token);
    return { success: true };
  }
}