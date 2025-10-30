// Tipos para el panel de administración
import { ReportFromBackend, ReportStatus } from './report.types';

/**
 * Filtros para la consulta de reportes en el admin
 */
export interface AdminFilters {
  city?: string;
  status?: ReportStatus;
  page: number;
  limit: number;
  search?: string;
}

/**
 * Respuesta paginada de reportes para admin
 */
export interface AdminReportsResponse {
  reports: ReportFromBackend[];
  total: number;
}

/**
 * DTO para cambiar el estado de un reporte
 */
export interface UpdateStatusDto {
  status: ReportStatus;
}
