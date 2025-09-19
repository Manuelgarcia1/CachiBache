import { Stack, Text } from "tamagui";
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
    <Stack marginTop="$6">
      <Text
        color="$blue3"
        fontSize="$4"
        textDecorationLine="underline"
        onPress={handleGuestLogin}
      >
        Ingresar como Invitado
      </Text>
    </Stack>
  );
}
