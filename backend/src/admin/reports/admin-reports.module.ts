import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminReportsController } from './controllers/admin-reports.controller';
import { AdminReportsService } from './services/admin-reports.service';
import { Report } from '@reports/entities/report.entity';

@Module({
  imports: [
    // Importar el repositorio de Report para que el servicio pueda usarlo
    TypeOrmModule.forFeature([Report]),
  ],
  controllers: [AdminReportsController],
  providers: [AdminReportsService],
  exports: [AdminReportsService], // Exportar por si otros módulos admin lo necesitan
})
export class AdminReportsModule {}
