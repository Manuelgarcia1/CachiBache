import { Injectable } from '@nestjs/common';
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
        // ✨ --- AÑADIR ESTA LÍNEA PARA DEPURAR --- ✨
        console.log('DTO RECIBIDO EN EL SERVICIO:', JSON.stringify(createReportDto, null, 2));

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
}