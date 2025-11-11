import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RegisterTokenDto } from './dto/register-token.dto';
import { UnregisterTokenDto } from './dto/unregister-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async registerToken(
    @GetUser() user: User,
    @Body() registerTokenDto: RegisterTokenDto,
  ) {
    await this.notificationsService.registerToken(
      user.id,
      registerTokenDto.token,
      registerTokenDto.deviceType,
    );

    return {
      message: 'Token registrado exitosamente',
      success: true,
    };
  }

  @Delete('unregister')
  @HttpCode(HttpStatus.OK)
  async unregisterToken(
    @GetUser() user: User,
    @Body() unregisterTokenDto: UnregisterTokenDto,
  ) {
    await this.notificationsService.unregisterToken(
      user.id,
      unregisterTokenDto.token,
    );

    return {
      message: 'Token desregistrado exitosamente',
      success: true,
    };
  }
}
