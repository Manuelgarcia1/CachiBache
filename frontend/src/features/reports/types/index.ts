import { Region } from 'react-native-maps';

export interface ReportLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface ReportData {
  address: string;
  severity: string;
  location: ReportLocation;
  image?: string;
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