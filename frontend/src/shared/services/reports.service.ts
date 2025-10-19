// Servicio para operaciones relacionadas con reportes
import { apiService } from './api.service';
import { ReportFromBackend, MapReport, mapReportToMapReport, ReportSeverity } from '../types/report.types';

/**
 * DTO para crear un reporte
 * NOTA: El backend aún no soporta el campo 'image'
 */
export interface CreateReportDto {
  address: string;
  severity: ReportSeverity;
  location: {
    x: number; // longitude
    y: number; // latitude
  };
}

/**
 * Crear un nuevo reporte
 * Endpoint: POST /reports
 * Requiere autenticación
 */
export async function createReport(data: CreateReportDto): Promise<ReportFromBackend> {
  try {
    // Asegurarse de no enviar campos extra que el backend no acepta
    const payload = {
      address: data.address,
      severity: data.severity,
      location: data.location,
    };

    const report = await apiService.post<ReportFromBackend>('/reports', payload);
    return report;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
}

/**
 * Obtener todos los reportes del backend
 * Endpoint: GET /reports
 * No requiere autenticación
 */
export async function getAllReports(): Promise<MapReport[]> {
  try {
    const reports = await apiService.get<ReportFromBackend[]>('/reports');

    // Filtrar reportes descartados y convertir al formato del mapa
    const mapReports = reports
      .filter(report => report.status !== 'DESCARTADO')
      .map(mapReportToMapReport);

    return mapReports;
  } catch (error) {
    console.error('Error fetching reports from backend:', error);
    throw error;
  }
}

/**
 * Obtener reportes del usuario autenticado
 * Endpoint: GET /reports/user
 * Requiere autenticación
 */
export async function getUserReports(page = 1, limit = 10): Promise<{ reports: ReportFromBackend[]; total: number }> {
  try {
    const response = await apiService.get<{ reports: ReportFromBackend[]; total: number }>(
      `/reports/user?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw error;
  }
}
