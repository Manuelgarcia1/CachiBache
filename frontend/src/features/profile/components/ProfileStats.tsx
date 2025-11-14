import { Text, YStack, XStack } from 'tamagui';
import { Feather } from '@expo/vector-icons';

interface ProfileStatsProps {
  pendiente: number;
  reparacion: number;
  finalizado: number;
}

export function ProfileStats({ pendiente, reparacion, finalizado }: ProfileStatsProps) {
  return (
    <XStack gap="$3" flexWrap="wrap">
      {/* Card Pendiente */}
      <YStack
        flex={1}
        minWidth={95}
        maxWidth="31%"
        backgroundColor="#fff"
        borderRadius="$4"
        padding="$3"
        gap="$2"
        borderWidth={1}
        borderColor="#e5e5e5"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.08}
        shadowRadius={4}
        elevation={3}
      >
        <YStack
          backgroundColor="#fee2e2"
          padding="$2"
          borderRadius="$2"
          width={36}
          height={36}
          justifyContent="center"
          alignItems="center"
        >
          <Feather name="clock" size={18} color="#dc2626" />
        </YStack>
        <Text fontSize={32} fontWeight="700" color="#dc2626" lineHeight={36}>
          {pendiente}
        </Text>
        <Text fontSize={12} color="#64748b" fontWeight="600" numberOfLines={1}>
          Pendiente
        </Text>
      </YStack>

      {/* Card En Reparación */}
      <YStack
        flex={1}
        minWidth={95}
        maxWidth="31%"
        backgroundColor="#fff"
        borderRadius="$4"
        padding="$3"
        gap="$2"
        borderWidth={1}
        borderColor="#e5e5e5"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.08}
        shadowRadius={4}
        elevation={3}
      >
        <YStack
          backgroundColor="#fef3c7"
          padding="$2"
          borderRadius="$2"
          width={36}
          height={36}
          justifyContent="center"
          alignItems="center"
        >
          <Feather name="tool" size={18} color="#f59e0b" />
        </YStack>
        <Text fontSize={32} fontWeight="700" color="#f59e0b" lineHeight={36}>
          {reparacion}
        </Text>
        <Text fontSize={12} color="#64748b" fontWeight="600" numberOfLines={2}>
          En Reparación
        </Text>
      </YStack>

      {/* Card Finalizado */}
      <YStack
        flex={1}
        minWidth={95}
        maxWidth="31%"
        backgroundColor="#fff"
        borderRadius="$4"
        padding="$3"
        gap="$2"
        borderWidth={1}
        borderColor="#e5e5e5"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.08}
        shadowRadius={4}
        elevation={3}
      >
        <YStack
          backgroundColor="#d1fae5"
          padding="$2"
          borderRadius="$2"
          width={36}
          height={36}
          justifyContent="center"
          alignItems="center"
        >
          <Feather name="check-circle" size={18} color="#10b981" />
        </YStack>
        <Text fontSize={32} fontWeight="700" color="#10b981" lineHeight={36}>
          {finalizado}
        </Text>
        <Text fontSize={12} color="#64748b" fontWeight="600" numberOfLines={1}>
          Finalizado
        </Text>
      </YStack>
    </XStack>
  );
}
