// Ubicación: src/features/home/components/StatusLegend.tsx

import { Circle, Text, XStack } from 'tamagui';

export function StatusLegend() {
  return (
    <XStack
      justifyContent="space-evenly"
      alignItems="center"
      paddingVertical="$3"
      paddingHorizontal="$4"
      borderRadius="$12"
      backgroundColor="white"
      marginHorizontal="$4" // Solo margen horizontal para que quede pegado arriba
      marginTop="$4"
      // Reemplazamos elevation por las props de sombra de Tamagui
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={3}
      // Le damos un nombre para que no choque con otros elementos absolutos
      zIndex={10} 
    >
      <LegendItem color="$green10" label="Leve" />
      <LegendItem color="$orange10" label="Intermedio" />
      <LegendItem color="$red10" label="Grave" />
    </XStack>
  );
}

// El componente LegendItem se mantiene igual
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <XStack alignItems="center" space="$2">
      <Circle size={12} backgroundColor={color} />
      <Text fontSize={12} color="$gray10">
        {label}
      </Text>
    </XStack>
  );
}