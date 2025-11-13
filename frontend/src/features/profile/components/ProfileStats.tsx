import { Text, View, XStack } from 'tamagui';

interface ProfileStatsProps {
  pendiente: number;
  reparacion: number;
  finalizado: number;
}

export function ProfileStats({ pendiente, reparacion, finalizado }: ProfileStatsProps) {
  return (
    <XStack alignItems="center" marginVertical="$3">
      <View
        flex={1}
        height={50}
        backgroundColor="#e5e7eb"
        borderRadius={25}
        overflow="hidden"
        flexDirection="row"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={3}
      >
        {/* Pendiente */}
        <View
          flex={1}
          backgroundColor="#dc2626"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="#fff" fontWeight="700" fontSize={24}>
            {pendiente}
          </Text>
        </View>

        {/* Separador sutil */}
        <View width={1} backgroundColor="rgba(255,255,255,0.2)" />

        {/* Reparación */}
        <View
          flex={1}
          backgroundColor="#f59e42"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="#fff" fontWeight="700" fontSize={24}>
            {reparacion}
          </Text>
        </View>

        {/* Separador sutil */}
        <View width={1} backgroundColor="rgba(255,255,255,0.2)" />

        {/* Finalizado */}
        <View
          flex={1}
          backgroundColor="#22c55e"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="#fff" fontWeight="700" fontSize={24}>
            {finalizado}
          </Text>
        </View>
      </View>
    </XStack>
  );
}
