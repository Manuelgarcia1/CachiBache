import { router } from "expo-router";
import { Button, YStack, Text, XStack } from "tamagui";
import { useAuth } from "@/src/shared/contexts/AuthContext";

// Componente de botones de autenticación: maneja login con Google/Email y navegación a registro/recuperación
export function LoginButtons() {
  const { login } = useAuth();

  // Login directo con Google (genera token mock)
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

  // Navegación a pantalla de login con email
  const handleEmailNavigation = () => {
    console.log('📧 Navegando a pantalla de login con email...');
    router.navigate('/(auth)/login');
  };

  // Navegación a pantalla de registro
  const handleRegisterNavigation = () => {
    console.log('👤 Navegando a pantalla de registro...');
    router.navigate('/(auth)/register');
  };

  // Navegación a pantalla de recuperación de contraseña
  const handleForgotPasswordNavigation = () => {
    console.log('🔑 Navegando a pantalla de olvido de contraseña...');
    router.navigate('/(auth)/forgot-password');
  };

  return (
    <YStack space="$3" width="100%" maxWidth={300} alignItems="center">
      <Button
        size="$4"
        backgroundColor="$yellow8"
        color="$black"
        fontWeight="bold"
        borderRadius="$10"
        pressStyle={{ backgroundColor: "$yellow9" }}
        onPress={handleGoogleLogin}
        width="100%"
      >
        Ingresar con Google
      </Button>

      <Button
        size="$4"
        backgroundColor="white"
        color="$blue10"
        fontWeight="bold"
        borderRadius="$10"
        pressStyle={{ backgroundColor: "$gray4" }}
        onPress={handleEmailNavigation}
        width="100%"
      >
        Ingresar con Correo
      </Button>

      <YStack space="$3" marginTop="$4" alignItems="center">
        <XStack>
          <Text color="white" fontSize="$3">
            ¿No tienes una cuenta?{' '}
          </Text>
          <Text
            color="$yellow8"
            fontWeight="bold"
            fontSize="$3"
            pressStyle={{ opacity: 0.7 }}
            onPress={handleRegisterNavigation}
          >
            Regístrate
          </Text>
        </XStack>

        <Text
          color="$blue3"
          fontSize="$3"
          textDecorationLine="underline"
          pressStyle={{ color: 'white' }}
          onPress={handleForgotPasswordNavigation}
        >
          ¿Olvidaste tu contraseña?
        </Text>
      </YStack>
    </YStack>
  );
}
