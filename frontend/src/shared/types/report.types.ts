// Tipos compartidos para reportes que vienen del backend

export type ReportStatus = 'PENDIENTE' | 'EN_REPARACION' | 'RESUELTO' | 'DESCARTADO';

export type ReportSeverity = 'LEVE' | 'INTERMEDIO' | 'GRAVE';

/**
 * Estructura del reporte tal como viene del backend
 * La location puede venir en varios formatos según cómo TypeORM la serialice
 */
export interface PhotoFromBackend {
  id: string;
  url: string;
  publicId: string;
  createdAt: string;
}

export interface ReportFromBackend {
  id: string;
  address: string;
  description?: string; // Descripción opcional del bache
  status: ReportStatus;
  severity: ReportSeverity;
  location: string | { x: number; y: number } | { coordinates: [number, number] } | any; // Varios formatos posibles
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  photos?: PhotoFromBackend[];
}

/**
 * Formato de reporte procesado para usar en el mapa
 */
export interface MapReport {
  id: string;
  address: string;
  status: ReportStatus;
  severity: ReportSeverity;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
}

/**
 * Parsear la ubicación del backend a coordenadas
 * Maneja múltiples formatos que TypeORM puede devolver:
 * - String: "lng,lat" o "(lng,lat)" o "POINT(lng lat)"
 * - Objeto: {x: lng, y: lat}
 * - GeoJSON: {coordinates: [lng, lat]}
 */
export function parseLocationFromBackend(location: any): { latitude: number; longitude: number } {
  const DEFAULT_COORDS = {
    latitude: -34.6037,
    longitude: -58.3816,
  };

  // Validar que location existe
  if (!location) {
    return DEFAULT_COORDS;
  }

  try {
    // Caso 1: Objeto con propiedades x, y (formato común de PostGIS)
    // PostGIS POINT: x = longitude, y = latitude (estándar geográfico)
    if (typeof location === 'object' && 'x' in location && 'y' in location) {
      return {
        latitude: Number(location.y),   // y = latitude
        longitude: Number(location.x),  // x = longitude
      };
    }

    // Caso 2: GeoJSON {coordinates: [lng, lat]}
    if (typeof location === 'object' && 'coordinates' in location && Array.isArray(location.coordinates)) {
      return {
        latitude: Number(location.coordinates[1]),
        longitude: Number(location.coordinates[0]),
      };
    }

    // Caso 3: String con diferentes formatos
    if (typeof location === 'string') {
      // Formato: "(lng,lat)" o "POINT(lng lat)"
      let cleaned = location.replace(/POINT\s*\(/gi, '').replace(/[()]/g, '').trim();

      // Dividir por coma o espacio
      const parts = cleaned.includes(',')
        ? cleaned.split(',').map(s => s.trim())
        : cleaned.split(/\s+/);

      if (parts.length >= 2) {
        const lng = Number(parts[0]);
        const lat = Number(parts[1]);

        if (!isNaN(lng) && !isNaN(lat)) {
          return {
            latitude: lat,
            longitude: lng,
          };
        }
      }
    }

    // Si llegamos aquí, el formato no es reconocido
    return DEFAULT_COORDS;

  } catch (error) {
    return DEFAULT_COORDS;
  }
}

/**
 * Convertir un reporte del backend a formato para el mapa
 */
export function mapReportToMapReport(report: ReportFromBackend): MapReport {
  return {
    id: report.id,
    address: report.address,
    status: report.status,
    severity: report.severity,
    coordinate: parseLocationFromBackend(report.location),
    createdAt: new Date(report.createdAt),
  };
}

/**
 * Formatea el estado del reporte para mostrarlo de manera legible
 * Convierte "EN_REPARACION" a "EN REPARACIÓN", etc.
 */
export function formatReportStatus(status: ReportStatus): string {
  const statusMap: Record<ReportStatus, string> = {
    'PENDIENTE': 'PENDIENTE',
    'EN_REPARACION': 'EN REPARACIÓN',
    'RESUELTO': 'RESUELTO',
    'DESCARTADO': 'DESCARTADO',
  };

  return statusMap[status] || status;
}
