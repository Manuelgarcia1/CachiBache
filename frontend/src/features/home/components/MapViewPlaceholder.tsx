// Ubicación: src/features/home/components/MapViewPlaceholder.tsx

import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { YStack, Text } from 'tamagui';
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
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [reports, setReports] = useState<MapReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
    } catch (error) {
      console.log('Error getting current location:', error);
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