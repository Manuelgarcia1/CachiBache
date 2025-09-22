import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { ReportData, ReportLocation, MapRegion } from '../types';

const INITIAL_REGION: MapRegion = {
  latitude: -34.6037,
  longitude: -58.3816,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const useReportForm = () => {
  const [reportData, setReportData] = useState<ReportData>({
    title: '',
    description: '',
    location: {
      latitude: INITIAL_REGION.latitude,
      longitude: INITIAL_REGION.longitude,
      address: 'Buenos Aires, Argentina',
    },
  });

  const [mapRegion, setMapRegion] = useState<MapRegion>(INITIAL_REGION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateTitle = (title: string) => {
    setReportData(prev => ({ ...prev, title }));
  };

  const updateDescription = (description: string) => {
    setReportData(prev => ({ ...prev, description }));
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

  const handleMapPress = (coordinate: { latitude: number; longitude: number }) => {
    const newLocation: ReportLocation = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      address: `${coordinate.latitude.toFixed(4)}, ${coordinate.longitude.toFixed(4)}`,
    };
    updateLocation(newLocation);
  };

  const validateForm = (): boolean => {
    if (!reportData.title.trim() || !reportData.description.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa el título y la descripción del reporte');
      return false;
    }
    return true;
  };

  const submitReport = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Reporte enviado',
        'Tu reporte ha sido enviado exitosamente. Te notificaremos sobre su estado.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return true;
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el reporte. Intenta nuevamente.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reportData,
    mapRegion,
    isSubmitting,
    updateTitle,
    updateDescription,
    updateImage,
    updateLocation,
    updateMapRegion,
    handleMapPress,
    submitReport,
  };
};