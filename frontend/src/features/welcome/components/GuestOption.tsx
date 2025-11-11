import { YStack, Text } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/shared/contexts/AuthContext";

// Componente de opción invitado: permite acceso sin registro con funcionalidad limitada
export function GuestOption() {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  // Genera token de invitado (prefijo "guest-") para acceso temporal
  const handleGuestLogin = async () => {
    try {
      const guestToken = `guest-${Date.now()}`;
      console.log('👤 Iniciando como invitado...');
      console.log('🔑 Generando token de invitado:', guestToken);

      await login(guestToken, { name: 'Invitado' });

      console.log('✅ Login como invitado exitoso - La navegación será automática');
    } catch (error) {
      console.error('❌ Error en login como invitado:', error);
    }
  };

  return (
    <YStack position="absolute" bottom={insets.bottom + 32}>
      <Text
        color="$blue3"
        fontSize="$3"
        textDecorationLine="underline"
        pressStyle={{ color: 'white' }}
        onPress={handleGuestLogin}
      >
        Ingresar como Invitado
      </Text>
    </YStack>
  );
}
