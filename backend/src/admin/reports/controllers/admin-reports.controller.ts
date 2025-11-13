import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminReportsService } from '../services/admin-reports.service';
import { UpdateReportStatusDto } from '@reports/dto/update-report-status.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AdminGuard } from '@auth/guards/admin.guard';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, AdminGuard) // Todos los endpoints requieren autenticación y ser admin
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  /**
   * GET /admin/reports
   * Obtener todos los reportes con filtros y paginación
   */
  @Get()
  findAllForAdmin(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('city') city?: string,
    @Query('search') search?: string,
  ) {
    return this.adminReportsService.findAllForAdmin(
      +page,
      +limit,
      status,
      city,
      search,
    );
  }

  /**
   * GET /admin/reports/stats
   * Obtener estadísticas globales de reportes por estado
   */
  @Get('stats')
  getReportStats() {
    return this.adminReportsService.getReportStats();
  }

  /**
   * GET /admin/reports/dashboard/metrics
   * Obtener métricas completas del dashboard con filtros opcionales
   */
  @Get('dashboard/metrics')
  getDashboardMetrics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string | string[],
    @Query('city') city?: string,
  ) {
    const filters = {
      startDate,
      endDate,
      status: status ? (Array.isArray(status) ? status : [status]) : undefined,
      city,
    };

    return this.adminReportsService.getDashboardMetrics(filters);
  }

  /**
   * PATCH /admin/reports/:reportId/status
   * Cambiar el estado de un reporte
   */
  @Patch(':reportId/status')
  updateReportStatus(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() updateStatusDto: UpdateReportStatusDto,
  ) {
    return this.adminReportsService.updateReportStatus(
      reportId,
      updateStatusDto.status,
    );
  }
}
