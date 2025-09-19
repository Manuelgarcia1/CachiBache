import { router } from "expo-router";
import { Button, Stack } from "tamagui";
import { useAuth } from "@/src/shared/contexts/AuthContext";

export function LoginButtons() {
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const mockToken = `google-${Date.now()}`;
      console.log('🚀 Iniciando login con Google...');
      console.log('🔑 Generando token mock:', mockToken);

      await login(mockToken, { name: 'Usuario Google' });

      console.log('✅ Login exitoso - La navegación será automática');
    } catch (error) {
      console.error('❌ Error en login con Google:', error);
    }
  };

  const handleEmailNavigation = () => {
    console.log('📧 Navegando a pantalla de login con email...');
    router.navigate('/(auth)/login');
  };

  const handleRegisterNavigation = () => {
    console.log('👤 Navegando a pantalla de registro...');
    router.navigate('/register');
  };

  const handleForgotPasswordNavigation = () => {
    console.log('🔑 Navegando a pantalla de olvido de contraseña...');
    router.navigate('/ForgotPassword');
  };

  return (
    <Stack space="$3" width="100%" maxWidth={300}>
      <Button
        size="$4"
        backgroundColor="$yellow8"
        color="$gray12"
        fontWeight="600"
        borderRadius="$6"
        pressStyle={{ backgroundColor: "$yellow9" }}
        onPress={handleGoogleLogin}
      >
        Ingresar con Google
      </Button>

      <Button
        size="$4"
        backgroundColor="transparent"
        borderColor="$blue3"
        borderWidth={2}
        color="white"
        fontWeight="600"
        borderRadius="$6"
        pressStyle={{ backgroundColor: "$blue9" }}
        onPress={handleEmailNavigation}
      >
        Ingresar con Correo
      </Button>

      <Button
        size="$4"
        backgroundColor="transparent"
        borderColor="$green8"
        borderWidth={2}
        color="white"
        fontWeight="600"
        borderRadius="$6"
        pressStyle={{ backgroundColor: "$green9" }}
        onPress={handleRegisterNavigation}
      >
        Crear Cuenta Nueva
      </Button>

      <Button
        size="$4"
        backgroundColor="transparent"
        borderColor="$orange8"
        borderWidth={2}
        color="white"
        fontWeight="600"
        borderRadius="$6"
        pressStyle={{ backgroundColor: "$orange9" }}
        onPress={handleForgotPasswordNavigation}
      >
        ¿Olvidaste tu contraseña?
      </Button>
    </Stack>
  );
}
