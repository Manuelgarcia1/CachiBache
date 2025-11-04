import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { AdminReportsModule } from '@admin/reports/admin-reports.module';

@Module({
  imports: [AdminReportsModule],
  controllers: [PdfController],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
