import MapView, { Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { Button, Text, XStack, YStack } from 'tamagui';
import { ReportLocation, MapRegion } from '@features/reports/types';
import { CustomMarker } from './CustomMarker';

interface LocationMapSectionProps {
  location: ReportLocation;
  mapRegion: MapRegion;
  onMapPress: (event: any) => void;
  onGetCurrentLocation: () => void;
  isGettingLocation?: boolean;
}

export function LocationMapSection({
  location,
  mapRegion,
  onMapPress,
  onGetCurrentLocation,
  isGettingLocation = false,
}: LocationMapSectionProps) {
  return (
    <YStack backgroundColor="#fff" padding="$4" borderRadius={12} gap="$3">
      <XStack alignItems="center" justifyContent="space-between">
        <Text fontSize={18} fontWeight="600" color="#1e293b">
          Ubicación
        </Text>
        <Button
          size="$3"
          backgroundColor="#3b82f6"
          icon={<Feather name="map-pin" size={16} color="#fff" />}
          onPress={onGetCurrentLocation}
          borderRadius={8}
          disabled={isGettingLocation}
          opacity={isGettingLocation ? 0.7 : 1}
        >
          {isGettingLocation ? 'Obteniendo...' : 'Mi ubicación'}
        </Button>
      </XStack>

      <Text fontSize={12} color="#64748b">
        Toca en el mapa para seleccionar la ubicación exacta del bache
      </Text>

      <YStack
        height={200}
        borderRadius={12}
        overflow="hidden"
        borderWidth={1}
        borderColor="#e2e8f0"
      >
        <MapView
          style={{ flex: 1 }}
          region={mapRegion}
          onPress={onMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Ubicación del bache"
            description={location.address}
          >
            <CustomMarker />
          </Marker>
        </MapView>
      </YStack>

      <Text fontSize={12} color="#64748b">
        📍 {location.address}
      </Text>
    </YStack>
  );
}