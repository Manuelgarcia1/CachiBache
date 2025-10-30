// Gráfico simple de barras para estado de reportes
import { YStack, XStack, Text } from 'tamagui';

interface StatusChartProps {
  data: Record<string, number>;
}

const STATUS_CONFIG = {
  PENDIENTE: { label: 'Pendiente', color: '#f59e0b' },
  EN_REPARACION: { label: 'En Reparación', color: '#3b82f6' },
  RESUELTO: { label: 'Resuelto', color: '#10b981' },
  DESCARTADO: { label: 'Descartado', color: '#ef4444' },
};

export function StatusChart({ data }: StatusChartProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return (
      <YStack
        backgroundColor="#fff"
        borderRadius="$4"
        padding="$4"
        gap="$3"
        borderWidth={1}
        borderColor="$gray5"
      >
        <Text fontSize={18} fontWeight="bold">
          Reportes por Estado
        </Text>
        <Text fontSize={14} color="$gray10">
          No hay datos disponibles
        </Text>
      </YStack>
    );
  }

  return (
    <YStack
      backgroundColor="#fff"
      borderRadius="$4"
      padding="$4"
      gap="$3"
      borderWidth={1}
      borderColor="$gray5"
    >
      <Text fontSize={18} fontWeight="bold">
        Reportes por Estado
      </Text>

      {/* Barras */}
      <YStack gap="$3" marginTop="$2">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = data[key] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <YStack key={key} gap="$2">
              {/* Label y valor */}
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={14} color="$gray11">
                  {config.label}
                </Text>
                <Text fontSize={14} fontWeight="600">
                  {count} ({percentage.toFixed(0)}%)
                </Text>
              </XStack>

              {/* Barra de progreso */}
              <XStack
                backgroundColor="$gray4"
                height={8}
                borderRadius="$2"
                overflow="hidden"
              >
                <YStack
                  backgroundColor={config.color}
                  width={`${percentage}%`}
                  height="100%"
                />
              </XStack>
            </YStack>
          );
        })}
      </YStack>
    </YStack>
  );
}
