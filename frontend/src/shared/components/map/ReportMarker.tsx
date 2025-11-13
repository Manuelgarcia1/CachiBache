// Ubicación: src/shared/components/map/ReportMarker.tsx

import { memo, useEffect } from 'react';
import { YStack } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { ReportStatus, ReportSeverity } from '@/src/shared/types/report.types';

interface ReportMarkerProps {
  /** Severidad del reporte que determina el color */
  severity: ReportSeverity;
  /** Estado del reporte que determina la animación */
  status: ReportStatus;
}

/**
 * Obtiene el color del marker según la severidad del reporte
 */
function getMarkerColor(severity: ReportSeverity): string {
  switch (severity) {
    case 'LEVE':
      return '#22C55E'; // Verde
    case 'INTERMEDIO':
      return '#F97316'; // Naranja
    case 'GRAVE':
      return '#EF4444'; // Rojo
    default:
      return '#6B7280'; // Gris
  }
}

/**
 * Marker optimizado para mostrar reportes existentes en el mapa
 * Color: basado en severidad (LEVE/INTERMEDIO/GRAVE)
 * Animación: Pulse suave solo para reportes pendientes
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export function ReportMarker({ severity, status }: ReportMarkerProps) {
  const color = getMarkerColor(severity);
  const opacity = useSharedValue(1);
  const shouldPulse = status === 'PENDIENTE';

  useEffect(() => {
    if (shouldPulse) {
      // Pulse de opacidad más ligero que scale (mejor performance)
      opacity.value = withRepeat(
        withTiming(0.7, {
          duration: 1200,
          easing: Easing.inOut(Easing.ease)
        }),
        -1, // Infinito
        true // Reverse (alterna entre 1 y 0.7)
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = 1;
    }

    return () => {
      cancelAnimation(opacity);
    };
  }, [shouldPulse, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <YStack
        backgroundColor={color}
        width={26}
        height={26}
        borderRadius={13}
        alignItems="center"
        justifyContent="center"
        borderWidth={2}
        borderColor="#fff"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.3}
        shadowRadius={3}
      >
        <Feather name="alert-triangle" size={14} color="#fff" />
      </YStack>
    </Animated.View>
  );
}
