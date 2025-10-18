import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../services/users.service';

import { ReportsService } from '../../reports/services/reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UseGuards } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reportsService: ReportsService, // Inyecta el servicio de reportes
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: User) {
    // Obtén los datos de reportes y dashboard
    const { reportStats, dashboard } = await this.reportsService.getUserStatsAndDashboard(user.id);

    // Devuelve el usuario y los datos extra
    return {
      user,
      reportStats,
      dashboard,
    };
  }
}