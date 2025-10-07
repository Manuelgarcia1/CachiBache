// Ubicación: src/features/ForgotPassword/components/ForgotPasswordScreen.tsx

import { AppLogo } from "@features/welcome/components/AppLogo"; // Importa el componente del logo de la aplicación.
import { Header } from "@sharedcomponents/index"; // Importa el componente de encabezado compartido.
import { router } from "expo-router"; // Herramienta de navegación de Expo Router.
import React, { useState } from "react";
import {
  Alert, // Para mostrar alertas al usuario.
  KeyboardAvoidingView, // Para ajustar la vista cuando el teclado aparece.
  Platform, // Para detectar la plataforma (iOS/Android).
  StyleSheet, // Para definir estilos.
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Para asegurar que el contenido no se superponga con las áreas seguras del dispositivo.
import { ScrollView, YStack } from "tamagui"; // Componentes de UI de Tamagui para el layout.
import { ForgotPasswordForm } from "./ForgotPasswordForm"; // Importa el formulario de recuperación de contraseña.

// Componente de pantalla para "Olvidé mi Contraseña".
export const ForgotPasswordScreen: React.FC = () => {
  const [loading, setLoading] = useState(false); // Estado para controlar el indicador de carga.

  // Función para manejar el botón de retroceso.
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back(); // Vuelve a la pantalla anterior si es posible.
    } else {
      router.replace("/"); // Si no hay pantalla anterior, navega a la raíz.
    }
  };

  // Función para manejar el envío del formulario de recuperación de contraseña.
  const handleSubmit = async (email: string) => {
    setLoading(true); // Activa el estado de carga.
    try {
      console.log("Enviando email de recuperación a:", email);
      // Simula una llamada a la API con un retardo de 2 segundos.
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Email de recuperación enviado exitosamente");

      // Muestra una alerta de éxito y navega hacia atrás.
      Alert.alert(
        "Email Enviado",
        "Hemos enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada.",
        [{ text: "OK", onPress: handleBack }]
      );
    } catch (error) {
      console.error("Error al enviar email de recuperación:", error);
      // Muestra una alerta de error si la operación falla.
      Alert.alert(
        "Error",
        "No pudimos enviar el email de recuperación. Por favor, intenta nuevamente."
      );
    } finally {
      setLoading(false); // Desactiva el estado de carga.
    }
  };

  return (
    // Área segura para el contenido de la pantalla.
    <SafeAreaView style={styles.safeArea}>
      {/* Encabezado con botón de retroceso. */}
      <Header onPress={handleBack} />
      {/* Ajusta la vista para evitar que el teclado oculte los campos. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Contenedor con scroll para el contenido. */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Contenedor principal con estilos de Tamagui. */}
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            width="100%"
            space="$4"
          >
            {/* Logo de la aplicación. */}
            <AppLogo size={250} />

            {/* Formulario de recuperación de contraseña. */}
            <ForgotPasswordForm onSubmit={handleSubmit} loading={loading} />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Estilos de la pantalla.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#094b7eff", // Color de fondo.
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
});
