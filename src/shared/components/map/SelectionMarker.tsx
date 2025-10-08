// Ubicación: src/shared/components/map/SelectionMarker.tsx

import { useEffect } from 'react';
import { YStack } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

interface SelectionMarkerProps {
  /** Key única que cambia cuando se mueve el marker (ej: coordenadas) */
  locationKey?: string;
}

/**
 * Marker para seleccionar ubicación de reportes
 * Usado en la pantalla de crear reporte
 * Animación: Bounce/pulse solo cuando cambia de posición
 */
export function SelectionMarker({ locationKey }: SelectionMarkerProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (locationKey) {
      // Animación de bounce al cambiar ubicación
      scale.value = withSequence(
        withTiming(1.3, { duration: 150 }),
        withTiming(0.9, { duration: 150 }),
        withTiming(1.1, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [locationKey, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <YStack
        backgroundColor="#ef4444"
        width={30}
        height={30}
        borderRadius={15}
        alignItems="center"
        justifyContent="center"
        borderWidth={2}
        borderColor="#fff"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.3}
        shadowRadius={3}
      >
        <Feather name="alert-triangle" size={16} color="#fff" />
      </YStack>
    </Animated.View>
  );
}
