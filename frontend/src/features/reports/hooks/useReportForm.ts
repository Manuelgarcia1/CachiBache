import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { ReportData, ReportLocation, MapRegion, ReportSeverity } from '../types';
import { createReport } from '@/src/shared/services/reports.service';
import { ApiError } from '@/src/shared/services/api.service';

const INITIAL_REGION: MapRegion = {
  latitude: -34.6037,
  longitude: -58.3816,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const useReportForm = () => {
  const [reportData, setReportData] = useState<ReportData>({
    address: '',
    severity: '',
    location: {
      latitude: INITIAL_REGION.latitude,
      longitude: INITIAL_REGION.longitude,
      address: 'Buenos Aires, Argentina',
    },
    image: null,
  });

  const [mapRegion, setMapRegion] = useState<MapRegion>(INITIAL_REGION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateAddress = (address: string) => {
    setReportData(prev => ({ ...prev, address }));
  };

  const updateSeverity = (severity: string) => {
    setReportData(prev => ({ ...prev, severity }));
  };

  const updateImage = (image: string) => {
    setReportData(prev => ({ ...prev, image }));
  };

  const updateLocation = (location: ReportLocation) => {
    setReportData(prev => ({ ...prev, location }));
  };

  const updateMapRegion = (region: MapRegion) => {
    setMapRegion(region);
  };

  const handleMapPress = (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    if (coordinate && coordinate.latitude !== undefined && coordinate.longitude !== undefined) {
      const newLocation: ReportLocation = {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        address: `${coordinate.latitude.toFixed(4)}, ${coordinate.longitude.toFixed(4)}`,
      };
      updateLocation(newLocation);
    }
  };

  const validateForm = (): boolean => {
    if (!reportData.address.trim()) {
      Alert.alert('Campo requerido', 'Por favor completa la dirección');
      return false;
    }
    if (!reportData.severity.trim()) {
      Alert.alert('Campo requerido', 'Por favor selecciona la severidad');
      return false;
    }
    return true;
  };

  const submitReport = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createReport({
        address: reportData.address,
        severity: reportData.severity as ReportSeverity,
        location: {
          x: reportData.location.longitude,
          y: reportData.location.latitude,
        },
      });

      Alert.alert(
        "¡Reporte enviado!",
        "Tu reporte ha sido enviado exitosamente. Te notificaremos sobre su estado."
      );

      router.replace("/(app)/reports");
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : "No se pudo crear el reporte";

      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reportData,
    mapRegion,
    isSubmitting,
    updateAddress,
    updateSeverity,
    updateImage,
    updateLocation,
    updateMapRegion,
    handleMapPress,
    submitReport,
  };
};