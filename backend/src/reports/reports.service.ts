import { Injectable } from '@nestjs/common'; // He quitado NotFoundException porque no se usa
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
    ) { }

    async create(createReportDto: CreateReportDto, user: User): Promise<Report> {
        const newReport = this.reportRepository.create({
            ...createReportDto,
            location: `${createReportDto.location.x},${createReportDto.location.y}`,
            user: user, // Asignamos el objeto de usuario completo
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