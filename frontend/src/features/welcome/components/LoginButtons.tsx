import { router } from "expo-router";
import { useState } from "react";
import { Button, YStack, Text, XStack, Spinner } from "tamagui";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { authService } from "@/src/shared/services/authService";

// Componente de botones de autenticación: maneja login con Google/Email y navegación a registro/recuperación
export function LoginButtons() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Iniciar login con Google
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🚀 Iniciando login con Google...');

      // Autenticar con Google y obtener respuesta del backend
      const { accessToken, user } = await authService.loginWithGoogle();

      console.log('✅ Autenticación con backend exitosa');

      // Guardar el token JWT en SecureStore
      await login(accessToken, {
        name: user.fullName,
        email: user.email,
      });

      console.log('✅ Login completado - La navegación será automática');
    } catch (error) {
      console.error('❌ Error en login con Google:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Error al iniciar sesión con Google'
      );
    } finally {
      setIsLoading(false);
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
      {error && (
        <Text color="$red10" fontSize="$3" textAlign="center">
          {error}
        </Text>
      )}

      <Button
        size="$4"
        backgroundColor="$yellow8"
        color="$black"
        fontWeight="bold"
        borderRadius="$10"
        pressStyle={{ backgroundColor: "$yellow9" }}
        onPress={handleGoogleLogin}
        width="100%"
        disabled={isLoading}
        icon={isLoading ? <Spinner color="$black" /> : undefined}
      >
        {isLoading ? 'Iniciando sesión...' : 'Ingresar con Google'}
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
