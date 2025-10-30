// Servicio para operaciones de administrador
import { apiService } from './api.service';
import {
  AdminFilters,
  AdminReportsResponse,
  UpdateStatusDto,
} from '../types/admin.types';
import { ReportFromBackend } from '../types/report.types';

/**
 * Obtener todos los reportes con filtros (solo admin)
 * Endpoint: GET /reports/admin/all
 * Requiere autenticación + AdminGuard
 */
export async function getAllReportsAdmin(
  filters: Partial<AdminFilters>
): Promise<AdminReportsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.city) params.append('city', filters.city);
    if (filters.search) params.append('search', filters.search);

    const response = await apiService.get<AdminReportsResponse>(
      `/reports/admin/all?${params.toString()}`
    );

    return response;
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    throw error;
  }
}

/**
 * Cambiar el estado de un reporte (solo admin)
 * Endpoint: PATCH /reports/admin/:reportId/status
 * Requiere autenticación + AdminGuard
 */
export async function updateReportStatus(
  reportId: string,
  status: UpdateStatusDto['status']
): Promise<ReportFromBackend> {
  try {
    const response = await apiService.patch<ReportFromBackend>(
      `/reports/admin/${reportId}/status`,
      { status }
    );

    return response;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}

/**
 * Obtener métricas para el dashboard (admin)
 * Endpoint: GET /reports/metrics/dashboard
 * Requiere autenticación
 */
export async function getDashboardMetrics(): Promise<{
  totalReports: number;
  reportsBySeverity: Record<string, number>;
  reportsByStatus: Record<string, number>;
}> {
  try {
    const response = await apiService.get<{
      totalReports: number;
      reportsBySeverity: Record<string, number>;
      reportsByStatus: Record<string, number>;
    }>('/reports/metrics/dashboard');

    return response;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
}
