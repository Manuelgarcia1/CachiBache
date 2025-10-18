import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { ReportData, ReportLocation, MapRegion } from '../types';
import { useAuth } from "@/src/shared/contexts/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

  const { token } = useAuth();

  const submitReport = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        address: reportData.address,
        severity: reportData.severity,
        location: {
          x: reportData.location.longitude,
          y: reportData.location.latitude,
        },
      }),
      });

      const errorData = await response.json();
      if (!response.ok) {
        console.log("Error backend:", errorData);
        throw new Error(errorData.message || "Error al crear el reporte");
      }

      Alert.alert("¡Reporte enviado!", "Tu reporte ha sido enviado exitosamente. Te notificaremos sobre su estado.");
      router.replace("/(app)/reports");
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo crear el reporte");
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