import { Feather } from '@expo/vector-icons';
import { Card, Text, View, XStack, YStack, Separator } from 'tamagui';

interface ProfileDashboardProps {
  tiempoPromedioPendiente: number;
  tiempoPromedioReparacion: number;
  bachesMes: number[];
  meses: string[];
}

export function ProfileDashboard({ tiempoPromedioPendiente, tiempoPromedioReparacion, bachesMes, meses }: ProfileDashboardProps) {
  // Solo últimos 4 meses
  const lastMonths = meses.slice(-4);
  const lastBaches = bachesMes.slice(-4);
  return (
    <XStack gap="$3">
      {/* --- TARJETA DE TIEMPO PROMEDIO (REDİSEÑADA) --- */}
      <Card
        flex={1}
        padding="$4"
        backgroundColor="#094b7e" // Mantenemos el azul oscuro
        borderRadius="$6" // Bordes consistentes
        height={180}
        elevation={5} // Sutil sombra
      >
        <YStack flex={1} space="$3">
          <Text fontSize="$5" color="white" fontWeight="bold" opacity={0.8}>
            TIEMPO PROMEDIO (DÍAS)
          </Text>

          <XStack flex={1} alignItems="center" justifyContent="space-between">
            {/* Dato de Pendientes */}
            <YStack alignItems="center" space="$2">
              <Text fontSize="$9" color="white" fontWeight="bold">
                {tiempoPromedioPendiente.toFixed(1)}
              </Text>
              <Text fontSize="$3" color="white">
                Pendiente
              </Text>
            </YStack>

            {/* Separador vertical */}
            <Separator vertical borderColor="$blue7" height="60%" />

            {/* Dato de Reparación */}
            <YStack alignItems="center" space="$2">
              <Text fontSize="$9" color="white" fontWeight="bold">
                {tiempoPromedioReparacion.toFixed(1)}
              </Text>
              <Text fontSize="$3" color="white">
                Reparación
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </Card>

      {/* --- TARJETA DE BACHES REPORTADOS (se mantiene similar) --- */}
      <Card
        flex={1}
        padding="$4"
        backgroundColor="#094b7e"
        borderRadius="$6"
        height={180}
        elevation={5}
      >
        <YStack flex={1} alignItems="center" space="$4">
          <Text fontSize="$5" color="white" fontWeight="bold" opacity={0.8}>
            REPORTES POR MES
          </Text>
          <XStack flex={1} gap="$3" alignItems="flex-end" justifyContent="center">
            {lastBaches.map((val, idx) => (
              <YStack key={idx} alignItems="center" space="$2">
                <View
                  width={24}
                  height={Math.max(val * 10, 10)} // Aseguramos una altura mínima
                  backgroundColor="white"
                  borderRadius="$2"
                />
                <Text fontSize="$2" color="white">
                  {lastMonths[idx]}
                </Text>
              </YStack>
            ))}
          </XStack>
        </YStack>
      </Card>
    </XStack>
  );
}
