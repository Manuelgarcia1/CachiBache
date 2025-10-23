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
import { UpdateReportStatusDto } from '../dto/update-report-status.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // 2. Importar el Guard
import { AdminGuard } from '../../auth/guards/admin.guard'; // Guard de admin
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

  @Get('user')
  @UseGuards(JwtAuthGuard)
  findReportsByUser(
    @GetUser() user: User, // Usa el decorador para obtener el usuario del token
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.reportsService.findReportsByUserId(
      user.id, // Usa el id del usuario autenticado
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

  // ============ ENDPOINTS PARA ADMINISTRADORES ============

  /**
   * GET /reports/admin/all
   * Obtener todos los reportes con filtros (solo admins)
   */
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAllForAdmin(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('city') city?: string,
    @Query('search') search?: string,
  ) {
    return this.reportsService.findAllForAdmin(
      +page,
      +limit,
      status,
      city,
      search,
    );
  }

  /**
   * PATCH /reports/admin/:reportId/status
   * Cambiar estado de un reporte (solo admins)
   */
  @Patch('admin/:reportId/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateReportStatus(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() updateStatusDto: UpdateReportStatusDto,
  ) {
    return this.reportsService.updateReportStatus(
      reportId,
      updateStatusDto.status,
    );
  }
}
