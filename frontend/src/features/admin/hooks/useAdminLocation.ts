import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

interface AdminLocationState {
  city: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para detectar automáticamente la ciudad del administrador
 * basándose en su ubicación GPS actual
 */
export const useAdminLocation = () => {
  const [state, setState] = useState<AdminLocationState>({
    city: null,
    isLoading: true,
    error: null,
  });

  const getCityFromCoordinates = async (latitude: number, longitude: number): Promise<string | null> => {
    try {
      // Reverse geocoding: coordenadas -> dirección
      const [location] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (!location) {
        return null;
      }

      // Prioridad: city > subregion > region
      const city = location.city || location.subregion || location.region || null;

      console.log('📍 Ciudad detectada:', city);
      console.log('🗺️ Detalles de ubicación:', {
        city: location.city,
        subregion: location.subregion,
        region: location.region,
        country: location.country,
      });

      return city;
    } catch (error) {
      console.error('Error en reverse geocoding:', error);
      return null;
    }
  };

  const detectCity = useCallback(async () => {
    try {
      setState({ city: null, isLoading: true, error: null });

      // 1. Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setState({
          city: null,
          isLoading: false,
          error: 'Se requieren permisos de ubicación para filtrar reportes por ciudad',
        });
        return;
      }

      // 2. Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 3. Convertir coordenadas a ciudad
      const city = await getCityFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      if (!city) {
        setState({
          city: null,
          isLoading: false,
          error: 'No se pudo determinar la ciudad actual',
        });
        return;
      }

      setState({
        city,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error detectando ciudad:', error);
      setState({
        city: null,
        isLoading: false,
        error: 'Error al obtener la ubicación',
      });
    }
  }, []); // useCallback sin dependencias porque no usa variables externas

  // Detectar ciudad automáticamente al montar el componente
  useEffect(() => {
    detectCity();
  }, [detectCity]); // ✅ Incluye detectCity en las dependencias

  return {
    city: state.city,
    isLoadingCity: state.isLoading,
    cityError: state.error,
    retryDetectCity: detectCity,
  };
};
