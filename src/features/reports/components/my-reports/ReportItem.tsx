import { Text, View, XStack, YStack } from 'tamagui';

interface ReportItemProps {
  title: string;
  date: string;
  status: string;
  location: string;
}

// Función para obtener color y ancho según estado
function getBarProps(status: string) {
  switch (status) {
    case 'PENDIENTE':
      return { color: '#dc3826', width: '20%' };
    case 'EN REPARACION':
      return { color: '#fabd15', width: '66%' };
    case 'FINALIZADO':
      return { color: '#22c566', width: '100%' };
    default:
      return { color: '#e5e7eb', width: '0%' };
  }
}

export function ReportItem({ title, date, status, location }: ReportItemProps) {
  const { color, width } = getBarProps(status);
  return (
    <YStack padding="$3" backgroundColor="#fff" borderRadius={12} shadowColor="#000" shadowOpacity={0.05} gap="$2">
      <Text fontSize={24} fontWeight="600">{title}</Text>
      {/* Barra de estado visual */}
      <YStack gap="$1">
        <XStack alignItems="center" gap="$2">
          <View
            flex={1}
            height={12}
            backgroundColor="#e5e7eb"
            borderRadius={6}
            overflow="hidden"
          >
            <View
              height={12}
              width={width}
              backgroundColor={color}
              borderRadius={6}
              position="absolute"
              left={0}
              top={0}
            />
          </View>
        </XStack>
      </YStack>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={18} fontWeight="600" color="#334155">
          {status}
        </Text>
        <Text fontSize={12} color="#64748b">
          Último cambio: {date}
        </Text>
      </XStack>
    </YStack>
  );
}