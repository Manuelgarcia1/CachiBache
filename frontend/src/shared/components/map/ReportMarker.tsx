// Ubicación: src/shared/components/map/ReportMarker.tsx

import { useEffect } from 'react';
import { YStack } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

type ReportStatus = 'PENDIENTE' | 'EN REPARACION' | 'FINALIZADO';

interface ReportMarkerProps {
  /** Estado del reporte que determina el color y animación */
  status: ReportStatus;
}

/**
 * Obtiene el color del marker según el estado del reporte
 */
function getMarkerColor(status: ReportStatus): string {
  switch (status) {
    case 'PENDIENTE':
      return '#EF4444'; // Rojo
    case 'EN REPARACION':
      return '#F97316'; // Naranja
    case 'FINALIZADO':
      return '#22C55E'; // Verde
    default:
      return '#6B7280'; // Gris
  }
}

/**
 * Marker para mostrar reportes existentes en el mapa
 * Usado en la pantalla home
 * Animación: Pulse continuo solo para reportes pendientes
 */
export function ReportMarker({ status }: ReportMarkerProps) {
  const color = getMarkerColor(status);
  const scale = useSharedValue(1);
  const shouldPulse = status === 'PENDIENTE';

  useEffect(() => {
    if (shouldPulse) {
      // Pulse continuo suave para reportes pendientes
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinito
        false
      );
    } else {
      scale.value = 1;
    }
  }, [shouldPulse, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <YStack
        backgroundColor={color}
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
        <Feather name="alert-triangle" size={16} color="#fff" />
      </YStack>
    </Animated.View>
  );
}
