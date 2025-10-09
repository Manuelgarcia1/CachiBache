import { Text, View, XStack } from 'tamagui';

interface ProfileStatsProps {
  pendiente: number;
  reparacion: number;
  finalizado: number;
}

export function ProfileStats({ pendiente, reparacion, finalizado }: ProfileStatsProps) {
  return (
    <XStack alignItems="center" marginVertical="$4">
      <View flex={1} height={40} backgroundColor="#e5e7eb" borderRadius={20} overflow="hidden" flexDirection="row">
        <View flex={1} backgroundColor="#dc2626" justifyContent="center" alignItems="center">
          <Text color="#fff" fontWeight="700" fontSize={22}>{pendiente}</Text>
        </View>
        <View flex={1} backgroundColor="#f59e42" justifyContent="center" alignItems="center">
          <Text color="#fff" fontWeight="700" fontSize={22}>{reparacion}</Text>
        </View>
        <View flex={1} backgroundColor="#22c55e" justifyContent="center" alignItems="center">
          <Text color="#fff" fontWeight="700" fontSize={22}>{finalizado}</Text>
        </View>
      </View>
    </XStack>
  );
}
