import { useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { LocationPermissionResult, ReportLocation, MapRegion } from '../types';

export const useLocationPermissions = () => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const requestLocationPermission = async (): Promise<LocationPermissionResult> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu ubicación para mejorar la precisión del reporte.');
        return { granted: false };
      }
      return { granted: true };
    } catch (error) {
      console.log('Error requesting location permission:', error);
      return { granted: false, error: 'Error al solicitar permisos de ubicación' };
    }
  };

  const getCurrentLocation = async (): Promise<{ location?: ReportLocation; region?: MapRegion; error?: string }> => {
    setIsGettingLocation(true);

    try {
      const permissionResult = await requestLocationPermission();
      if (!permissionResult.granted) {
        return { error: permissionResult.error };
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Realizar reverse geocoding para obtener la dirección real
      let address = 'Ubicación actual';
      try {
        const [geocodedLocation] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocodedLocation) {
          // Construir dirección legible
          const addressParts: string[] = [];

          if (geocodedLocation.street) {
            if (geocodedLocation.streetNumber) {
              addressParts.push(`${geocodedLocation.street} ${geocodedLocation.streetNumber}`);
            } else {
              addressParts.push(geocodedLocation.street);
            }
          }

          if (geocodedLocation.city) {
            addressParts.push(geocodedLocation.city);
          } else if (geocodedLocation.subregion) {
            addressParts.push(geocodedLocation.subregion);
          }

          if (geocodedLocation.region && geocodedLocation.region !== geocodedLocation.city) {
            addressParts.push(geocodedLocation.region);
          }

          if (addressParts.length > 0) {
            address = addressParts.join(', ');
          }

          console.log('📍 Dirección de ubicación actual:', address);
        }
      } catch (geocodeError) {
        console.log('⚠️ No se pudo obtener dirección para ubicación actual, usando texto genérico');
      }

      const newLocation: ReportLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address, // Ahora contiene dirección real o "Ubicación actual" como fallback
      };

      const newRegion: MapRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      return { location: newLocation, region: newRegion };
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
      return { error: 'No se pudo obtener la ubicación actual' };
    } finally {
      setIsGettingLocation(false);
    }
  };

  return {
    getCurrentLocation,
    isGettingLocation,
  };
};