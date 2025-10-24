import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReportStatus } from '../entities/report-status.enum';

/**
 * DTO para actualizar solo el estado de un reporte (admin)
 */
export class UpdateReportStatusDto {
  @IsEnum(ReportStatus, {
    message:
      'El estado debe ser: PENDIENTE, EN_REPARACION, RESUELTO o DESCARTADO',
  })
  @IsNotEmpty({ message: 'El estado es requerido' })
  status: ReportStatus;
}
