import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common'; 
import { UsersService } from '../services/users.service';
import { ReportsService } from '../../reports/services/reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { UpdateAvatarDto } from '../dto/update-avatar.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reportsService: ReportsService, // Inyecta el servicio de reportes
  ) {}

  /**
   * GET /users/me
   * Obtener perfil del usuario con estadísticas de reportes
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: User) {
    // Obtén los datos de reportes y dashboard
    const { reportStats, dashboard } =
      await this.reportsService.getUserStatsAndDashboard(user.id);

    // Devuelve el usuario y los datos extra
    return {
      user,
      reportStats,
      dashboard,
    };
  }

  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  async updateAvatar(
    @GetUser() user: User, // Obtenemos el usuario autenticado
    @Body() updateAvatarDto: UpdateAvatarDto, // Validamos el body
  ) {
    // Llamamos al servicio para actualizar el campo 'avatar'
    const updatedUser = await this.usersService.updateProfile(user.id, {
      avatar: updateAvatarDto.avatarUrl,
    });
    return updatedUser;
  }
}
