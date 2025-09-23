import { YStack, Text } from "tamagui";
import { useAuth } from "@/src/shared/contexts/AuthContext";

export function GuestOption() {
  const { login } = useAuth();

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
    <YStack position="absolute" bottom="$8">
      <Text
        color="$blue3" // Mismo color que "¿Olvidaste tu contraseña?"
        fontSize="$3" // Mismo tamaño
        textDecorationLine="underline"
        pressStyle={{ color: 'white' }}
        onPress={handleGuestLogin}
      >
        Ingresar como Invitado
      </Text>
    </YStack>
  );
}
