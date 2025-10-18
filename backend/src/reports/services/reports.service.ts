import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { Report } from '../entities/report.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto, user: User): Promise<Report> {
    // ✨ --- AÑADIR ESTA LÍNEA PARA DEPURAR --- ✨
    console.log(
      'DTO RECIBIDO EN EL SERVICIO:',
      JSON.stringify(createReportDto, null, 2),
    );

    const { location, ...reportData } = createReportDto;

    const newReport = this.reportRepository.create({
      ...reportData,
      location: `${location.x},${location.y}`,
      user: user,
    });

    return this.reportRepository.save(newReport);
  }
  async findAll(): Promise<Report[]> {
    return this.reportRepository.find({
      relations: ['user'],
    });
  }

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

  async getDashboardMetrics() {
    const totalReports = await this.reportRepository.count();
    const reportsBySeverity = await this.reportRepository
      .createQueryBuilder('report')
      .select('report.severity', 'severity')
      .addSelect('COUNT(report.id)', 'count')
      .groupBy('report.severity')
      .getRawMany();

    const reportsByStatus = await this.reportRepository
      .createQueryBuilder('report')
      .select('report.status', 'status')
      .addSelect('COUNT(report.id)', 'count')
      .groupBy('report.status')
      .getRawMany();

    return {
      totalReports,
      reportsBySeverity: reportsBySeverity.reduce((acc, curr) => {
        acc[curr.severity] = parseInt(curr.count, 10);
        return acc;
      }, {}),
      reportsByStatus: reportsByStatus.reduce((acc, curr) => {
        acc[curr.status] = parseInt(curr.count, 10);
        return acc;
      }, {}),
    };
  }

  async findReportsByUserId(
    userId: string,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ reports: Report[]; total: number }> {
    const query = this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.user', 'user')
      .where('user.id = :userId', { userId });

    if (search) {
      query.andWhere('report.address ILIKE :search', { search: `%${search}%` });
    }

    const [reports, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { reports, total };
  }

  async findOneReport(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['user', 'photos', 'history'],
    });
    if (!report) {
      throw new NotFoundException(`Reporte con ID "${id}" no encontrado`);
    }
    return report;
  }

  async updateReport(
    id: string,
    updateReportDto: UpdateReportDto,
  ): Promise<Report> {
    const report = await this.findOneReport(id);

    if (updateReportDto.location) {
      report.location = `${updateReportDto.location.x},${updateReportDto.location.y}`;
      delete updateReportDto.location; // Eliminar para que Object.assign no lo sobreescriba
    }

    Object.assign(report, updateReportDto);
    return this.reportRepository.save(report);
  }

  async getUserStatsAndDashboard(userId: string) {
  // Estadísticas por estado
  const stats = await this.reportRepository
    .createQueryBuilder('report')
    .select('report.status', 'status')
    .addSelect('COUNT(report.id)', 'count')
    .where('report.user_id = :userId', { userId })
    .groupBy('report.status')
    .getRawMany();

  const reportStats = stats.reduce((acc, curr) => {
    acc[curr.status] = parseInt(curr.count, 10);
    return acc;
  }, {});

  // Ejemplo de dashboard: reportes por mes (últimos 6 meses)
  const bachesMes = await this.reportRepository
    .createQueryBuilder('report')
    .select("TO_CHAR(report.createdAt, 'Mon')", 'mes')
    .addSelect('COUNT(report.id)', 'count')
    .where('report.user_id = :userId', { userId })
    .groupBy('mes')
    .orderBy('mes', 'ASC')
    .getRawMany();

  return {
    reportStats,
    dashboard: {
      tiempoPromedioPendiente: 0, // Calcula según tu modelo si tienes los datos
      tiempoPromedioReparacion: 0, // Calcula según tu modelo si tienes los datos
      bachesMes: bachesMes.map((m) => Number(m.count)),
      meses: bachesMes.map((m) => m.mes),
    },
  };
}
}
