import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { Report } from '../entities/report.entity';
import { ReportStatus } from '../entities/report-status.enum';
import { User } from '@users/entities/user.entity';
import { Photo } from '../entities/photo.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,

    // 2. Inyecta el repositorio de la entidad Photo
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async create(createReportDto: CreateReportDto, user: User): Promise<Report> {
    // 3. Extraemos 'photo' del DTO junto con los demás datos
    const { location, photo, ...reportData } = createReportDto;

    // 4. Creamos la instancia del Reporte, pero aún no la guardamos
    const newReport = this.reportRepository.create({
      ...reportData,
      location: `${location.x},${location.y}`,
      user: user,
    });

    // 5. Guardamos el reporte principal en la base de datos
    const savedReport = await this.reportRepository.save(newReport);

    // 6. Si el DTO incluía datos de una foto...
    if (photo) {
      // 7. Creamos la instancia de la Photo, asociándola con el reporte recién guardado
      const newPhoto = this.photoRepository.create({
        url: photo.url,
        publicId: photo.publicId,
        report: savedReport, // <-- Aquí está la magia de la relación
      });

      // 8. Guardamos la foto en su propia tabla
      await this.photoRepository.save(newPhoto);
    }

    // 9. Devolvemos el reporte principal.
    return this.findOneReport(savedReport.id);
  }
  /**
   * Obtener todos los reportes (endpoint público)
   * NO incluye datos de usuario para proteger información personal
   */
  async findAll(): Promise<Report[]> {
    return this.reportRepository.find({
      // No incluir relations: ['user'] para proteger datos personales (email, teléfono, etc.)
      // Este endpoint es público y solo debe mostrar datos del reporte
    });
  }


  async findReportsByUserId(
    userId: string,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ reports: Report[]; total: number }> {
    // --- 👇 REESCRIBIMOS LA LÓGICA CON EL MÉTODO 'findAndCount' 👇 ---

    const where: FindManyOptions<Report>['where'] = {
      user: { id: userId },
    };

    if (search) {
      where.address = ILike(`%${search}%`); // ILIKE para búsqueda case-insensitive
    }

    const [reports, total] = await this.reportRepository.findAndCount({
      where,
      relations: ['user', 'photos'], // <-- Explícitamente pedimos las relaciones aquí
      order: {
        updatedAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

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
