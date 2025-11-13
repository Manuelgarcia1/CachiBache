import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { ReportData, ReportLocation, MapRegion, ReportSeverity } from '../types';
import { createReport } from '@/src/shared/services/reports.service';
import { ApiError } from '@/src/shared/services/api.service';
import { cloudinaryService } from '@/src/shared/services/cloudinary.service';

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
    description: '',
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

  /**
   * Convierte coordenadas (lat, lng) a una dirección legible
   * Usa reverse geocoding para obtener el nombre real de la calle y ciudad
   */
  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      const [location] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (!location) {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }

      // Construir dirección en orden: calle + número, ciudad, región
      const addressParts: string[] = [];

      // Calle y número
      if (location.street) {
        if (location.streetNumber) {
          addressParts.push(`${location.street} ${location.streetNumber}`);
        } else {
          addressParts.push(location.street);
        }
      }

      // Ciudad
      if (location.city) {
        addressParts.push(location.city);
      } else if (location.subregion) {
        addressParts.push(location.subregion);
      }

      // Región/Provincia (solo si es diferente de la ciudad)
      if (location.region && location.region !== location.city) {
        addressParts.push(location.region);
      }

      const fullAddress = addressParts.length > 0
        ? addressParts.join(', ')
        : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      return fullAddress;
    } catch (error) {
      console.error('Error en reverse geocoding:', error);
      // Fallback: usar coordenadas
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleMapPress = async (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    if (coordinate && coordinate.latitude !== undefined && coordinate.longitude !== undefined) {
      // Obtener dirección legible desde las coordenadas
      const address = await getAddressFromCoordinates(
        coordinate.latitude,
        coordinate.longitude
      );

      const newLocation: ReportLocation = {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        address, // Ahora contiene dirección real: "Av. Colón 123, Córdoba"
      };

      updateLocation(newLocation);
      // También actualizar el campo address del formulario
      updateAddress(address);
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
      let photoData: { url: string; publicId: string } | undefined = undefined;
      if (reportData.image) {
        try {
          const uploadResult = await cloudinaryService.uploadImage(
            reportData.image,
            'reports',
          );
          photoData = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          };

        } catch (uploadError) {
          // Este catch capturará CUALQUIER error de la función uploadImage
          console.error('🔴 [useReportForm] ERROR DETECTADO DURANTE LA SUBIDA A CLOUDINARY:', uploadError);
          // Re-lanzamos el error para que el catch principal lo maneje y muestre la alerta
          throw new Error('Fallo en la subida de la imagen a Cloudinary.');
        }
      }

      // Llamada al backend para crear el reporte
      await createReport({
        address: reportData.address,
        severity: reportData.severity as ReportSeverity,
        description: reportData.description || undefined, // Solo enviar si no está vacío
        location: {
          x: reportData.location.longitude,
          y: reportData.location.latitude,
        },
        // Aquí pasamos photoData, que será undefined si no se subió imagen
        photo: photoData,
      });

      Alert.alert(
        "¡Reporte enviado!",
        "Tu reporte ha sido enviado exitosamente. Te notificaremos sobre su estado."
      );
      router.replace("/(app)/reports");

    } catch (error) {
      console.error('🔴 [useReportForm] ERROR GLOBAL CAPTURADO:', error);

      // Creamos un mensaje más detallado
      let errorMessage = 'No se pudo crear el reporte. Inténtalo de nuevo.';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        // Esto es importante, capturará el mensaje de los errores que lanzamos manualmente
        errorMessage = error.message;
      }

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
    updateDescription,
    updateImage,
    updateLocation,
    updateMapRegion,
    handleMapPress,
    submitReport,
  };
};