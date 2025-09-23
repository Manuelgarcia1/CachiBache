// Ubicación: src/features/home/components/MapViewPlaceholder.tsx

import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { YStack } from 'tamagui';
import MapView, { Marker, Region } from 'react-native-maps';

interface ReportMarker {
  id: string;
  title: string;
  status: 'PENDIENTE' | 'EN REPARACION' | 'FINALIZADO';
  coordinate: {
    latitude: number;
    longitude: number;
  };
  location: string;
}

// Datos de ejemplo - luego estos vendrán de una API o estado global
const MOCK_REPORTS: ReportMarker[] = [
  {
    id: '1',
    title: 'Entre Ríos 742',
    status: 'PENDIENTE',
    coordinate: { latitude: -34.6037, longitude: -58.3816 },
    location: 'Entre Ríos 742',
  },
  {
    id: '2',
    title: 'Av. San Lorenzo 123',
    status: 'EN REPARACION',
    coordinate: { latitude: -34.6040, longitude: -58.3820 },
    location: 'Av. San Lorenzo 123',
  },
  {
    id: '3',
    title: 'Boulevard Central 456',
    status: 'FINALIZADO',
    coordinate: { latitude: -34.6035, longitude: -58.3810 },
    location: 'Boulevard Central 456',
  },
];

const INITIAL_REGION: Region = {
  latitude: -34.6037,
  longitude: -58.3816,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

function getMarkerColor(status: string): string {
  switch (status) {
    case 'PENDIENTE':
      return '#EF4444';
    case 'EN REPARACION':
      return '#F97316';
    case 'FINALIZADO':
      return '#22C55E';
    default:
      return '#6B7280';
  }
}

export function MapViewPlaceholder() {
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
        {MOCK_REPORTS.map((report) => (
          <Marker
            key={report.id}
            coordinate={report.coordinate}
            title={report.title}
            description={`Estado: ${report.status} - ${report.location}`}
          >
            <YStack
              backgroundColor={getMarkerColor(report.status)}
              width={32}
              height={32}
              borderRadius={16}
              alignItems="center"
              justifyContent="center"
              borderWidth={2}
              borderColor="#fff"
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.3}
              shadowRadius={3}
            >
              <Feather
                name="alert-triangle"
                size={16}
                color="#fff"
              />
            </YStack>
          </Marker>
        ))}
      </MapView>
    </YStack>
  );
}