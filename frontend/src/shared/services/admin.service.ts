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
 * Endpoint: GET /admin/reports
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
      `/admin/reports?${params.toString()}`
    );

    return response;
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    throw error;
  }
}

/**
 * Cambiar el estado de un reporte (solo admin)
 * Endpoint: PATCH /admin/reports/:reportId/status
 * Requiere autenticación + AdminGuard
 */
export async function updateReportStatus(
  reportId: string,
  status: UpdateStatusDto['status']
): Promise<ReportFromBackend> {
  try {
    const response = await apiService.patch<ReportFromBackend>(
      `/admin/reports/${reportId}/status`,
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
 * Endpoint: GET /admin/reports/dashboard/metrics
 * Requiere autenticación + AdminGuard
 */
export async function getDashboardMetrics(filters?: {
  city?: string;
  startDate?: string;
  endDate?: string;
  status?: string[];
}): Promise<{
  totalReports: number;
  reportsBySeverity: Record<string, number>;
  reportsByStatus: Record<string, number>;
}> {
  try {
    const params = new URLSearchParams();

    if (filters?.city) params.append('city', filters.city);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status && filters.status.length > 0) {
      filters.status.forEach((status) => params.append('status', status));
    }

    const url = params.toString()
      ? `/admin/reports/dashboard/metrics?${params.toString()}`
      : '/admin/reports/dashboard/metrics';

    const response = await apiService.get<{
      totalReports: number;
      reportsBySeverity: Record<string, number>;
      reportsByStatus: Record<string, number>;
    }>(url);

    return response;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
}

/**
 * Exportar reportes como PDF (solo admin)
 * Endpoint: GET /reports/admin/export/pdf
 * Requiere autenticación + AdminGuard
 */
export async function exportReportsPDF(filters: {
  startDate?: string;
  endDate?: string;
  status?: string[];
}): Promise<Blob> {
  try {
    const params = new URLSearchParams();

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.status && filters.status.length > 0) {
      filters.status.forEach((status) => params.append('status', status));
    }

    // Usar apiService.getBlob que maneja automáticamente la autenticación
    const blob = await apiService.getBlob(
      `/reports/admin/export/pdf?${params.toString()}`
    );

    return blob;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
}
