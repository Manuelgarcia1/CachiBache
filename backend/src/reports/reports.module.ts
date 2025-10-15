import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/reports.controller';
import { Report } from './entities/report.entity';
import { Photo } from './entities/photo.entity';
import { ReportHistory } from './entities/report-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Photo, ReportHistory])], // <-- Registra todas las entidades
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
