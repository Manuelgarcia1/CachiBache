// Ubicación: src/features/home/components/ReportButton.tsx

import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from 'tamagui';

export function ReportButton() {
  const handlePress = () => {
    router.push('/create-report');
  };

  return (
    <Button
      onPress={handlePress}
      backgroundColor="$yellow10"
      color="black"
      icon={<Feather name="camera" size={24} color="black" />}
      size="$6"
      borderRadius="$12"
      // Sombras correctas
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.2}
      shadowRadius={5}
      // Lo posicionamos con margen
      marginHorizontal="$4"
      marginBottom="$5" // Margen respecto al fondo de su contenedor
      pressStyle={{
        backgroundColor: '$yellow9'
      }}
    >
      Reportar Bache
    </Button>
  );
}