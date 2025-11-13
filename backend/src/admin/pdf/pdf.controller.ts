import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { PdfService, PdfExportFilters } from './pdf.service';
import { AdminReportsService } from '@admin/reports/services/admin-reports.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AdminGuard } from '@auth/guards/admin.guard';

@Controller('reports/admin/export')
@UseGuards(JwtAuthGuard, AdminGuard)
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly adminReportsService: AdminReportsService,
  ) {}

  @Get('pdf')
  async exportPdf(
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string | string[],
  ) {
    try {
      // Construir filtros
      const filters: PdfExportFilters = {
        startDate,
        endDate,
        status: status
          ? Array.isArray(status)
            ? status
            : [status]
          : undefined,
      };

      // Obtener estadísticas con filtros aplicados
      const statistics =
        await this.adminReportsService.getDashboardMetrics(filters);

      // Generar PDF
      const pdfBuffer = await this.pdfService.generateReportPdf(
        statistics,
        filters,
      );

      // Configurar headers de respuesta
      const fileName = `reporte-cachibache-${new Date().toISOString().split('T')[0]}.pdf`;

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length,
      });

      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      console.error('Error generando PDF:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al generar el PDF',
        error: error.message,
      });
    }
  }
}
