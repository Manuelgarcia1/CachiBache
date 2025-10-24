// Tarjeta de métrica para el dashboard
import { YStack, XStack, Text } from 'tamagui';
import { Feather } from '@expo/vector-icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  backgroundColor: string;
  description?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  iconColor,
  backgroundColor,
  description,
}: MetricCardProps) {
  return (
    <YStack
      backgroundColor="#fff"
      borderRadius="$4"
      padding="$4"
      gap="$3"
      borderWidth={1}
      borderColor="$gray5"
      flex={1}
      minWidth={200}
    >
      {/* Header con icono */}
      <XStack justifyContent="space-between" alignItems="flex-start">
        <Text fontSize={14} color="$gray10" fontWeight="500">
          {title}
        </Text>
        <YStack
          backgroundColor={backgroundColor}
          borderRadius="$3"
          padding="$2"
          width={40}
          height={40}
          justifyContent="center"
          alignItems="center"
        >
          <Feather name={icon} size={20} color={iconColor} />
        </YStack>
      </XStack>

      {/* Valor */}
      <Text fontSize={32} fontWeight="bold" color="$gray12">
        {value}
      </Text>

      {/* Descripción opcional */}
      {description && (
        <Text fontSize={12} color="$gray10">
          {description}
        </Text>
      )}
    </YStack>
  );
}
