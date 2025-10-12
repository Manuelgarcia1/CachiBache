// Ubicación: src/features/home/components/MapViewPlaceholder.tsx

import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { YStack } from 'tamagui';
import MapView, { Marker, Region } from 'react-native-maps';
import { ReportMarker } from '@sharedcomponents/map';

interface ReportData {
  id: string;
  title: string;
  status: 'PENDIENTE' | 'EN REPARACION' | 'FINALIZADO';
  coordinate: {
    latitude: number;
    longitude: number;
  };
  location: string;
}

/**
 * Genera reportes mock alrededor de una ubicación dada
 * Los markers aparecen en un radio de ~500m alrededor del centro
 */
function generateMockReportsNearLocation(lat: number, lng: number): ReportData[] {
  return [
    {
      id: '1',
      title: 'Bache en calle principal',
      status: 'PENDIENTE',
      coordinate: { latitude: lat + 0.003, longitude: lng + 0.002 },
      location: 'Calle Principal 742',
    },
    {
      id: '2',
      title: 'Bache en avenida',
      status: 'EN REPARACION',
      coordinate: { latitude: lat - 0.002, longitude: lng + 0.003 },
      location: 'Avenida Central 123',
    },
    {
      id: '3',
      title: 'Bache reparado',
      status: 'FINALIZADO',
      coordinate: { latitude: lat + 0.001, longitude: lng - 0.002 },
      location: 'Boulevard Sur 456',
    },
  ];
}

const INITIAL_REGION: Region = {
  latitude: -34.6037,
  longitude: -58.3816,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export function MapViewPlaceholder() {
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [mockReports, setMockReports] = useState<ReportData[]>(
    generateMockReportsNearLocation(INITIAL_REGION.latitude, INITIAL_REGION.longitude)
  );

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

      // Generar markers alrededor de la nueva ubicación
      setMockReports(
        generateMockReportsNearLocation(
          location.coords.latitude,
          location.coords.longitude
        )
      );
    } catch (error) {
      console.log('Error getting current location:', error);
    }
  };

  useEffect(() => {
    requestLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {mockReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={report.coordinate}
            title={report.title}
            description={`Estado: ${report.status} - ${report.location}`}
          >
            <ReportMarker status={report.status} />
          </Marker>
        ))}
      </MapView>
    </YStack>
  );
}