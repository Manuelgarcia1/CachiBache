import { router } from "expo-router";
import { Button, YStack, Text, XStack } from "tamagui";
import { Alert } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { authService } from "@/src/shared/services/auth.service";
import { env } from "@/src/shared/config/env";
import { useEffect, useState } from "react";

// Componente de botones de autenticación: maneja login con Google/Email y navegación a registro/recuperación
export function LoginButtons() {
  const { login } = useAuth();
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);

  // Configurar Google Sign-In al montar el componente
  useEffect(() => {
    try {
      GoogleSignin.configure({
        webClientId: env.googleWebClientId,
        offlineAccess: false,
      });
      setIsGoogleConfigured(true);
    } catch (error) {
      console.error('❌ Error configurando Google Sign-In:', error);
      setIsGoogleConfigured(false);
    }
  }, []);

  // Login con Google OAuth
  const handleGoogleLogin = async () => {
    if (!isGoogleConfigured) {
      Alert.alert(
        'Error de configuración',
        'Google Sign-In no está configurado correctamente. Por favor, verifica las variables de entorno.'
      );
      return;
    }

    try {
      // 1. Verificar si los servicios de Google Play están disponibles
      await GoogleSignin.hasPlayServices();

      // 2. Iniciar sesión con Google (abre el diálogo de Google)
      const userInfo = await GoogleSignin.signIn();

      // 3. Obtener el ID Token
      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        throw new Error('No se pudo obtener el ID Token de Google');
      }

      // 4. Enviar el ID Token al backend para validación y obtener nuestros tokens
      const response = await authService.loginWithGoogle(idToken);

      // 5. Guardar la sesión en el contexto
      await login(response.accessToken, response.user, response.refreshToken);
    } catch (error: any) {
      console.error('❌ Error en login con Google:', error);

      // Manejar errores específicos
      if (error.code === 'SIGN_IN_CANCELLED') {
        // Usuario canceló el login
      } else if (error.code === 'IN_PROGRESS') {
        // Login ya en progreso
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        Alert.alert(
          'Error',
          'Google Play Services no está disponible en este dispositivo'
        );
      } else {
        Alert.alert(
          'Error al iniciar sesión',
          error.message || 'No se pudo iniciar sesión con Google. Por favor, intenta nuevamente.'
        );
      }
    }
  };

  // Navegación a pantalla de login con email
  const handleEmailNavigation = () => {
    router.navigate('/(auth)/login');
  };

  // Navegación a pantalla de registro
  const handleRegisterNavigation = () => {
    router.navigate('/(auth)/register');
  };

  // Navegación a pantalla de recuperación de contraseña
  const handleForgotPasswordNavigation = () => {
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
