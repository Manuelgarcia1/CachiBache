import { router } from "expo-router";
import { Button, YStack, Text, Separator, XStack } from "tamagui";
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
    // Usamos YStack para apilar los elementos verticalmente
    <YStack space="$3" width="100%" maxWidth={300} alignItems="center">

      {/* --- BOTONES DE INGRESO PRINCIPALES --- */}
      <Button
        size="$4"
        backgroundColor="$yellow8"
        color="$black" // Texto negro para mejor contraste
        fontWeight="bold" // Hacemos el texto más fuerte
        borderRadius="$10" // Bordes más redondeados
        pressStyle={{ backgroundColor: "$yellow9" }}
        onPress={handleGoogleLogin}
        width="100%"
      >
        Ingresar con Google
      </Button>

      <Button
        size="$4"
        backgroundColor="white" // <-- CAMBIO: Fondo blanco como en la imagen
        color="$blue10" // <-- CAMBIO: Texto azul
        fontWeight="bold"
        borderRadius="$10"
        pressStyle={{ backgroundColor: "$gray4" }}
        onPress={handleEmailNavigation}
        width="100%"
      >
        Ingresar con Correo
      </Button>

      {/* --- ENLACES DE ACCIONES SECUNDARIAS --- */}
      <YStack space="$3" marginTop="$4" alignItems="center">
        {/* Enlace para registrarse */}
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

        {/* Enlace para recuperar contraseña */}
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