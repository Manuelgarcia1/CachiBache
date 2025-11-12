// Ubicación: src/features/home/components/MapViewPlaceholder.tsx

import { useEffect, useState, useCallback, memo } from 'react';
import * as Location from 'expo-location';
import { YStack, Text, Spinner } from 'tamagui';
import MapView, { Marker, Region } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { ReportMarker } from '@sharedcomponents/map';
import { MapReport } from '@/src/shared/types/report.types';
import { getAllReports } from '@/src/shared/services/reports.service';


const INITIAL_REGION: Region = {
  latitude: -34.6037,
  longitude: -58.3816,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export function MapViewPlaceholder() {
  const [region, setRegion] = useState<Region | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [reports, setReports] = useState<MapReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      if (status === 'granted') {
        await getCurrentLocation();
      } else {
        // Si no hay permiso, usar región por defecto
        setRegion(INITIAL_REGION);
        setIsLoadingLocation(false);
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
      setRegion(INITIAL_REGION);
      setIsLoadingLocation(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      // ⚡ Intentar primero con última ubicación conocida (INSTANTÁNEO)
      let location = await Location.getLastKnownPositionAsync({
        maxAge: 60000, // Usar ubicación de hace máximo 1 minuto
        requiredAccuracy: 1000, // 1km es suficiente para el mapa
      });

      // Si no hay última ubicación, obtener ubicación actual
      if (!location) {
        console.log('📍 No hay última ubicación, obteniendo actual...');

        // Usar Low accuracy para ser más rápido (1-2s vs 3-5s)
        const locationPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });

        // Timeout de 5 segundos
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        location = await Promise.race([locationPromise, timeoutPromise]) as any;
      } else {
        console.log('⚡ Usando última ubicación conocida');
      }

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      setIsLoadingLocation(false);
    } catch (error) {
      console.log('Error getting current location:', error);
      // Si falla obtener ubicación, usar región por defecto (Buenos Aires)
      setRegion(INITIAL_REGION);
      setIsLoadingLocation(false);
    }
  };

  const fetchReports = async () => {
    setIsLoadingReports(true);
    setError(null);
    try {
      const fetchedReports = await getAllReports();
      setReports(fetchedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('No se pudieron cargar los reportes');
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar reportes cada vez que la pantalla recibe focus
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  // Mostrar loading mientras se obtiene la ubicación inicial
  if (isLoadingLocation || !region) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#f8fafc">
        <Spinner size="large" color="$yellow9" />
        <Text marginTop="$3" fontSize="$4" color="$gray11">
          Obteniendo ubicación...
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsBuildings={true}
        showsTraffic={false}
        moveOnMarkerPress={false} // Optimización: reduce lag al tocar markers
        loadingEnabled={true}
        loadingIndicatorColor="#facc15"
      >
        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={report.coordinate}
            title={report.address}
            description={`Estado: ${report.status} | Severidad: ${report.severity}`}
          >
            <ReportMarker severity={report.severity} status={report.status} />
          </Marker>
        ))}
      </MapView>

      {/* Mostrar indicador de carga o error (opcional) */}
      {isLoadingReports && (
        <YStack
          position="absolute"
          top={80}
          alignSelf="center"
          backgroundColor="rgba(0,0,0,0.7)"
          padding="$2"
          borderRadius={8}
        >
          <Text color="#fff" fontSize={12}>Cargando reportes...</Text>
        </YStack>
      )}
      {error && (
        <YStack
          position="absolute"
          top={80}
          alignSelf="center"
          backgroundColor="rgba(239, 68, 68, 0.9)"
          padding="$2"
          borderRadius={8}
        >
          <Text color="#fff" fontSize={12}>{error}</Text>
        </YStack>
      )}
    </YStack>
  );
}