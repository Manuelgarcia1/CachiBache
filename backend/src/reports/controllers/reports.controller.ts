import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // 2. Importar el Guard
import { GetUser } from '../../auth/decorators/get-user.decorator'; // 3. Importar el Decorador
import { User } from '../../users/entities/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // 4. Proteger la ruta
  create(
    @Body() createReportDto: CreateReportDto,
    @GetUser() user: User, // 5. Obtener el usuario del token
  ) {
    return this.reportsService.create(createReportDto, user);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }
}
