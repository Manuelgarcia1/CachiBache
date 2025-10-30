import { useState } from 'react';
import { Text, View, XStack, YStack, AnimatePresence, Separator } from 'tamagui';
import { ReportDetail } from './ReportDetail';
import { Feather } from '@expo/vector-icons';


interface ReportItemProps {
  id: string;
  address: string;
  date: string;
  status: string;
  severity: string;
  photoUrl?: string; // La URL de la foto es opcional
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

export function ReportItem({ id, address, date, status, severity, photoUrl, location }: ReportItemProps) {
  const { color, width } = getBarProps(status);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    console.log(`[ReportItem] TOCADO! ID: ${id}. Nuevo estado: ${!isExpanded}`);
    setIsExpanded(!isExpanded);
  };
  return (
    <YStack
      padding="$4"
      backgroundColor="white"
      borderRadius="$6"
      gap="$3"
      elevation={2}
      pressStyle={{ scale: 0.98, backgroundColor: '$gray2' }} // Añadimos un feedback visual sutil
      onPress={handleToggleExpand} // 3. Pasamos la función directamente al YStack
    >
      {/* ... VISTA RESUMIDA ... */}
      <Text fontSize="$7" fontWeight="bold" color="$gray12">{address}</Text>

      <YStack>
        <View flex={1} height={12} backgroundColor="$gray3" borderRadius={6} overflow="hidden">
          <View height={12} width={width} backgroundColor={color} borderRadius={6} />
        </View>
      </YStack>

      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$5" fontWeight="600" color={color}>
          {status}
        </Text>
        <Text fontSize="$3" color="$gray10">
          {new Date(date).toLocaleDateString()}
        </Text>
      </XStack>

      {/* ... SEPARADOR Y BOTÓN "VER DETALLES" ... */}
      <Separator marginVertical="$2" borderColor="$gray4" />
      <XStack alignItems="center" space="$2" alignSelf="flex-end">
        <Text fontSize="$3" fontWeight="600" color="$blue10">
          {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
        </Text>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#3b82f6"
        />
      </XStack>

      {/* ... VISTA DETALLADA ... */}
      <YStack
        animation="quick"
        height={isExpanded ? 'auto' : 0}
        opacity={isExpanded ? 1 : 0}
        overflow="hidden"
      >
        <ReportDetail
          severity={severity}
          photoUrl={photoUrl}
          location={location}
          date={date}
        />
      </YStack>
    </YStack>
  );
}