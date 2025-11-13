import { Region } from 'react-native-maps';

// Re-exportar tipos compartidos del backend
export type { ReportStatus, ReportSeverity, ReportFromBackend, MapReport } from '@/src/shared/types/report.types';

// Tipos específicos del formulario de creación de reportes
export interface ReportLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface ReportData {
  address: string;
  severity: string;
  description?: string;
  location: ReportLocation;
  image?: string | null;
}

export interface MapRegion extends Region {}

export interface LocationPermissionResult {
  granted: boolean;
  error?: string;
}

export interface ImagePickerResult {
  uri?: string;
  error?: string;
}