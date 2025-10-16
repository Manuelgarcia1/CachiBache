import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // 2. Importar el Guard
import { EmailVerifiedGuard } from '../../auth/guards/email-verified.guard'; // Guard de verificación de email
import { GetUser } from '../../auth/decorators/get-user.decorator'; // 3. Importar el Decorador
import { User } from '../../users/entities/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard) // Requiere autenticación Y email verificado
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

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getReportStats() {
    return this.reportsService.getReportStats();
  }

  @Get('metrics/dashboard')
  @UseGuards(JwtAuthGuard)
  getDashboardMetrics() {
    return this.reportsService.getDashboardMetrics();
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findReportsByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.reportsService.findReportsByUserId(
      userId,
      +page,
      +limit,
      search,
    );
  }

  @Get(':reportId')
  @UseGuards(JwtAuthGuard)
  findOneReport(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return this.reportsService.findOneReport(reportId);
  }

  @Patch(':reportId')
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard) // Requiere email verificado para actualizar
  updateReport(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.updateReport(reportId, updateReportDto);
  }
}
