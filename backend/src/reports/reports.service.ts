import { Injectable } from '@nestjs/common'; // He quitado NotFoundException porque no se usa
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const { userId, location, ...reportData } = createReportDto;

    // Transformamos el objeto LocationDto a un string compatible con el tipo 'point'.
    const locationString = `${location.x},${location.y}`;

    // Creamos una instancia del reporte con los datos y la relación al usuario
    const newReport = this.reportRepository.create({
      ...reportData,
      location: locationString, // Usamos el string transformado
      user: { id: userId },     // Así se asigna una relación por ID
    });

    return this.reportRepository.save(newReport);
  }

  async findAll(): Promise<Report[]> {
    // Usamos 'relations' para que TypeORM traiga también los datos del usuario asociado
    return this.reportRepository.find({
      relations: ['user'],
    });
  }
}