import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '@reports/entities/report.entity';
import { ReportStatus } from '@reports/entities/report-status.enum';
import { NotificationsService } from '../../../notifications/notifications.service';

@Injectable()
export class AdminReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Obtener estadísticas globales de reportes
   * Agrupa por estado y cuenta cuántos reportes hay en cada uno
   */
  async getReportStats() {
    const stats = await this.reportRepository
      .createQueryBuilder('report')
      .select('report.status', 'status')
      .addSelect('COUNT(report.id)', 'count')
      .groupBy('report.status')
      .getRawMany();

    return stats.reduce((acc, curr) => {
      acc[curr.status] = parseInt(curr.count, 10);
      return acc;
    }, {});
  }

  /**
   * Obtener métricas del dashboard con filtros opcionales
   * Incluye estadísticas por estado, severidad y tasa de resolución
   */
  async getDashboardMetrics(filters?: {
    startDate?: string;
    endDate?: string;
    status?: string[];
    city?: string;
  }) {
    // Query builder base para total de reportes
    const totalQuery = this.reportRepository.createQueryBuilder('report');

    // Query builder para reportes por severidad
    const severityQuery = this.reportRepository
      .createQueryBuilder('report')
      .select('report.severity', 'severity')
      .addSelect('COUNT(report.id)', 'count')
      .groupBy('report.severity');

    // Query builder para reportes por estado
    const statusQuery = this.reportRepository
      .createQueryBuilder('report')
      .select('report.status', 'status')
      .addSelect('COUNT(report.id)', 'count')
      .groupBy('report.status');

    // Aplicar filtros si existen
    if (filters) {
      // Filtro por ciudad (busca en el campo address)
      if (filters.city) {
        totalQuery.andWhere('report.address ILIKE :city', {
          city: `%${filters.city}%`,
        });
        severityQuery.andWhere('report.address ILIKE :city', {
          city: `%${filters.city}%`,
        });
        statusQuery.andWhere('report.address ILIKE :city', {
          city: `%${filters.city}%`,
        });
      }

      // Filtro por fecha de inicio
      if (filters.startDate) {
        totalQuery.andWhere('report.createdAt >= :startDate', {
          startDate: filters.startDate,
        });
        severityQuery.andWhere('report.createdAt >= :startDate', {
          startDate: filters.startDate,
        });
        statusQuery.andWhere('report.createdAt >= :startDate', {
          startDate: filters.startDate,
        });
      }

      // Filtro por fecha de fin
      if (filters.endDate) {
        totalQuery.andWhere('report.createdAt <= :endDate', {
          endDate: filters.endDate,
        });
        severityQuery.andWhere('report.createdAt <= :endDate', {
          endDate: filters.endDate,
        });
        statusQuery.andWhere('report.createdAt <= :endDate', {
          endDate: filters.endDate,
        });
      }

      // Filtro por estado
      if (filters.status && filters.status.length > 0) {
        totalQuery.andWhere('report.status IN (:...statuses)', {
          statuses: filters.status,
        });
        severityQuery.andWhere('report.status IN (:...statuses)', {
          statuses: filters.status,
        });
        statusQuery.andWhere('report.status IN (:...statuses)', {
          statuses: filters.status,
        });
      }
    }

    // Ejecutar queries
    const totalReports = await totalQuery.getCount();
    const reportsBySeverity = await severityQuery.getRawMany();
    const reportsByStatus = await statusQuery.getRawMany();

    // Calcular métricas adicionales
    const reportsByStatusMap = reportsByStatus.reduce((acc, curr) => {
      acc[curr.status] = parseInt(curr.count, 10);
      return acc;
    }, {});

    const activeReports =
      (reportsByStatusMap['PENDIENTE'] || 0) +
      (reportsByStatusMap['EN_REPARACION'] || 0);

    const closedReports =
      (reportsByStatusMap['RESUELTO'] || 0) +
      (reportsByStatusMap['DESCARTADO'] || 0);

    const resolutionRate =
      totalReports > 0 ? (closedReports / totalReports) * 100 : 0;

    return {
      totalReports,
      reportsBySeverity: reportsBySeverity.reduce((acc, curr) => {
        acc[curr.severity] = parseInt(curr.count, 10);
        return acc;
      }, {}),
      reportsByStatus: reportsByStatusMap,
      activeReports,
      closedReports,
      resolutionRate,
    };
  }

  /**
   * Obtener todos los reportes con filtros y paginación (admin)
   * Incluye información del usuario que creó el reporte
   */
  async findAllForAdmin(
    page = 1,
    limit = 20,
    status?: string,
    city?: string,
    search?: string,
  ): Promise<{ reports: Report[]; total: number }> {
    const query = this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.user', 'user');

    // Filtro por estado
    if (status) {
      query.andWhere('report.status = :status', { status });
    }

    // Filtro por ciudad (busca en el campo address)
    if (city) {
      query.andWhere('report.address ILIKE :city', { city: `%${city}%` });
    }

    // Búsqueda general en dirección
    if (search) {
      query.andWhere('report.address ILIKE :search', { search: `%${search}%` });
    }

    // Ordenar por fecha de creación (más recientes primero)
    query.orderBy('report.createdAt', 'DESC');

    // Paginación
    const [reports, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { reports, total };
  }

  /**
   * Actualizar solo el estado de un reporte (admin)
   */
  async updateReportStatus(
    reportId: string,
    newStatus: ReportStatus,
  ): Promise<Report> {
    // Verificar que el reporte existe
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: ['user', 'photos'],
    });

    if (!report) {
      throw new NotFoundException(`Reporte con ID "${reportId}" no encontrado`);
    }

    // Actualizar solo el campo status
    await this.reportRepository.update(reportId, { status: newStatus });

    // Enviar notificación push al usuario que creó el reporte
    await this.notificationsService.sendReportStatusUpdate(
      report.user.id,
      reportId,
      newStatus,
    );

    // Devolver el reporte actualizado
    const updatedReport = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: ['user', 'photos'],
    });

    // Esto no debería suceder, pero TypeScript requiere la verificación
    if (!updatedReport) {
      throw new NotFoundException(
        `Reporte con ID "${reportId}" no encontrado después de actualizar`,
      );
    }

    return updatedReport;
  }
}
