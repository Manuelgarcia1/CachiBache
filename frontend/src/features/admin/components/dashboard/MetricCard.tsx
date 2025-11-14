// Tarjeta de métrica para el dashboard
import { YStack, Text } from "tamagui";
import { Feather } from "@expo/vector-icons";

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
      borderRadius="$5"
      padding="$4"
      gap="$3"
      borderWidth={1}
      borderColor="#e5e5e5"
      flex={1}
      minWidth={160}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={4}
      elevation={3}
    >
      {/* Icono en la parte superior */}
      <YStack
        backgroundColor={backgroundColor}
        borderRadius="$4"
        padding="$2.5"
        width={48}
        height={48}
        justifyContent="center"
        alignItems="center"
        alignSelf="flex-start"
      >
        <Feather name={icon} size={24} color={iconColor} />
      </YStack>

      {/* Valor destacado */}
      <Text fontSize={36} fontWeight="800" color="#1e293b" lineHeight={40}>
        {value}
      </Text>

      {/* Título */}
      <Text fontSize={14} color="#64748b" fontWeight="600" lineHeight={18}>
        {title}
      </Text>

      {/* Descripción opcional */}
      {description && (
        <Text fontSize={12} color="#94a3b8" lineHeight={16}>
          {description}
        </Text>
      )}
    </YStack>
  );
}
