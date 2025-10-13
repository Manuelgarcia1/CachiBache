import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/reports.controller';
import { Report } from './entities/report.entity';
import { Photo } from './entities/photo.entity';
import { ReportHistory } from './entities/report-history.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Photo, ReportHistory]), // Registra todas las entidades
    AuthModule, // Importar para usar JwtAuthGuard y @GetUser()
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
