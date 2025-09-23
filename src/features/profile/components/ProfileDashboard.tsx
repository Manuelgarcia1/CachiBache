import { Feather } from '@expo/vector-icons';
import { Card, Text, View, XStack, YStack } from 'tamagui';

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
      {/* Dash 1: Tiempo promedio */}
      <Card
  flex={1}
  padding="$4"
  paddingLeft={8}
  backgroundColor="#094b7e"
  borderRadius={16}
  alignItems="flex-start"
  justifyContent="center"
  shadowColor="#000"
  shadowOpacity={0.07}
  height={180}
  gap="$3"
      >
  <Text fontSize={14} color="#fff" fontWeight="700" marginBottom={0} marginTop={-18}>
          TIEMPO PROMEDIO (DÍAS)
        </Text>
        <YStack width="100%" alignItems="flex-start" justifyContent="center">
          <XStack width="100%" alignItems="flex-end" gap="$4" alignSelf="flex-start" justifyContent="flex-start">
            <YStack alignItems="center" maxWidth={50}>
              <Text fontSize={26} color="#fff" fontWeight="700" marginBottom={2}>
                {tiempoPromedioPendiente.toFixed(1)}
              </Text>
              <Text fontSize={13} color="#cbd5e1">Pendiente</Text>
            </YStack>
            <YStack alignItems="center" maxWidth={40}>
              <Feather name="clock" size={22} color="#facc15" style={{ marginBottom: 2 }} />
            </YStack>
            <YStack alignItems="center" maxWidth={60}>
              <Text fontSize={26} color="#fff" fontWeight="700" marginBottom={2}>
                {tiempoPromedioReparacion.toFixed(1)}
              </Text>
              <Text fontSize={13} color="#cbd5e1" textAlign="center" numberOfLines={2}>
                En reparación
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </Card>
      {/* Dash 2: Baches reportados por mes */}
      <Card
        flex={1}
        padding="$4"
        backgroundColor="#094b7e"
        borderRadius={16}
        alignItems="center"
        justifyContent="center"
        shadowColor="#000"
        shadowOpacity={0.07}
        height={180}
        gap="$3"
      >
        <Text fontSize={14} color="#fff" fontWeight="700" marginBottom="$2">
          BACHES REPORTADOS (MES)
        </Text>
        <XStack gap={8} alignItems="flex-end" height={70} width="100%" justifyContent="center" marginTop={20}>
          {lastBaches.map((val, idx) => (
            <YStack key={idx} alignItems="center" justifyContent="flex-end" width={32}>
              <View width={22} height={val * 7 + 10} backgroundColor="#fff" borderRadius={6} />
              <Text fontSize={13} color="#fff" marginTop={2} textAlign="center">
                {lastMonths[idx]}
              </Text>
            </YStack>
          ))}
        </XStack>
      </Card>
    </XStack>
  );
}
