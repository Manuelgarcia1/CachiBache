// Ubicación: src/features/home/components/MapViewPlaceholder.tsx

import { FontAwesome } from '@expo/vector-icons'; // Usaremos FontAwesome para un pin sólido
import type { DimensionValue } from 'react-native';
import { YStack } from 'tamagui';

interface MapPinProps {
  color: string;
  top: DimensionValue;
  left: DimensionValue;
}

export function MapViewPlaceholder() {
  return (
    // Cambia el color del fondo para que no sea tan claro
    <YStack flex={1} backgroundColor="$gray8" position="relative">
      {/* Marcadores de ejemplo con los colores correctos */}
      <MapPin color="#EF4444" top="20%" left="50%" />
      <MapPin color="#F97316" top="40%" left="70%" />
      <MapPin color="#22C55E" top="65%" left="30%" />
    </YStack>
  );
}

function MapPin({ color, top, left }: MapPinProps) {
    return (
        // Creamos un círculo de color como fondo del pin
        <YStack
          backgroundColor={color}
          width={40}
          height={40}
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
          position="absolute"
          top={top}
          left={left}
          // Le agregamos una pequeña sombra
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.3}
          shadowRadius={3}
        >
            <FontAwesome 
                name="map-pin" 
                size={20} 
                color="white" 
            />
        </YStack>
    );
}