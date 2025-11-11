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
      {/* --- TARJETA DE TIEMPO PROMEDIO (MEJORADA) --- */}
      <Card
        flex={1}
        padding="$4"
        backgroundColor="#0369a1"
        borderRadius="$6"
        height={180}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 3 }}
        shadowOpacity={0.15}
        shadowRadius={6}
        elevation={6}
      >
        <YStack flex={1} space="$3">
          <Text fontSize="$4" color="white" fontWeight="600" opacity={0.9} letterSpacing={0.5}>
            TIEMPO PROMEDIO (DÍAS)
          </Text>

          <XStack flex={1} alignItems="center" justifyContent="space-around">
            {/* Dato de Pendientes */}
            <YStack alignItems="center" space="$2">
              <Text fontSize="$9" color="white" fontWeight="bold">
                {tiempoPromedioPendiente.toFixed(1)}
              </Text>
              <Text fontSize="$2" color="rgba(255,255,255,0.85)" fontWeight="500">
                Pendiente
              </Text>
            </YStack>

            {/* Separador vertical mejorado */}
            <Separator vertical borderColor="rgba(255,255,255,0.25)" height="70%" />

            {/* Dato de Reparación */}
            <YStack alignItems="center" space="$2">
              <Text fontSize="$9" color="white" fontWeight="bold">
                {tiempoPromedioReparacion.toFixed(1)}
              </Text>
              <Text fontSize="$2" color="rgba(255,255,255,0.85)" fontWeight="500">
                Reparación
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </Card>

      {/* --- TARJETA DE BACHES REPORTADOS (MEJORADA) --- */}
      <Card
        flex={1}
        padding="$4"
        backgroundColor="#0369a1"
        borderRadius="$6"
        height={180}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 3 }}
        shadowOpacity={0.15}
        shadowRadius={6}
        elevation={6}
      >
        <YStack flex={1} alignItems="center" space="$3">
          <Text fontSize="$4" color="white" fontWeight="600" opacity={0.9} letterSpacing={0.5}>
            REPORTES POR MES
          </Text>
          <XStack flex={1} gap="$3" alignItems="flex-end" justifyContent="center" height={80}>
            {lastBaches.map((val, idx) => {
              const maxVal = Math.max(...lastBaches, 1);
              const maxHeight = 60;
              const barHeight = Math.max((val / maxVal) * maxHeight, 8);

              return (
                <YStack key={idx} alignItems="center" space="$1">
                  <View
                    width={22}
                    height={barHeight}
                    backgroundColor="white"
                    borderRadius="$3"
                    shadowColor="#000"
                    shadowOffset={{ width: 0, height: 1 }}
                    shadowOpacity={0.2}
                    shadowRadius={2}
                    elevation={2}
                  />
                  <Text fontSize={10} color="rgba(255,255,255,0.85)">
                    {lastMonths[idx]}
                  </Text>
                  <Text fontSize={11} color="white" fontWeight="bold">
                    {val}
                  </Text>
                </YStack>
              );
            })}
          </XStack>
        </YStack>
      </Card>
    </XStack>
  );
}
