// Ubicación: src/features/home/components/HomeScreen.tsx

import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';
import { MapViewPlaceholder } from './MapViewPlaceholder';
import { ReportButton } from './ReportButton';
import { StatusLegend } from './StatusLegend';

export function HomeScreen() {
  return (
    <YStack flex={1} backgroundColor="$background">
      {/* El mapa es la base, ocupa todo el espacio */}
      <MapViewPlaceholder />

      {/* 
        Este SafeAreaView se superpone al mapa. 
        StyleSheet.absoluteFillObject hace que ocupe toda la pantalla.
        pointerEvents="box-none" permite que los toques "atraviesen" las áreas vacías 
        del overlay y lleguen al mapa que está debajo.
      */}
      <SafeAreaView 
        style={[StyleSheet.absoluteFillObject]} 
        pointerEvents="box-none"
      >
        <YStack flex={1} pointerEvents="box-none">
          {/* La leyenda va arriba */}
          <StatusLegend />
          
          {/* El botón va abajo, dentro del mismo contenedor flotante */}
          <YStack flex={1} /> 
          <ReportButton />
        </YStack>
      </SafeAreaView>
    </YStack>
  );
}