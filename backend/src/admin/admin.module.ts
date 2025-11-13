import { Module } from '@nestjs/common';
import { AdminReportsModule } from '@admin/reports/admin-reports.module';
import { PdfModule } from '@admin/pdf/pdf.module';

/**
 * Módulo principal de administración
 * Agrupa todas las funcionalidades administrativas de la aplicación
 */
@Module({
  imports: [
    AdminReportsModule, // Gestión de reportes para administradores
    PdfModule, // Exportación de reportes a PDF
    // Aquí se pueden agregar más módulos admin en el futuro:
    // - AdminDashboardModule
    // - AdminUsersModule
    // etc.
  ],
})
export class AdminModule {}
