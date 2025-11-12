import { Header } from "@sharedcomponents/index";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterForm, RegisterFormData } from "./RegisterForm";
import { authService, type RegisterDto } from "@/src/shared/services/auth.service";
import { ApiError } from "@/src/shared/services/api.service";
import { useAuth } from "@/src/shared/contexts/AuthContext";

export function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);

    try {
      // Preparar datos para el backend (sin confirmPassword)
      const registerData: RegisterDto = {
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        phone: formData.phone || undefined,
        termsAccepted: formData.termsAccepted,
      };

      // Llamar al servicio de registro
      const response = await authService.register(registerData);

      // Guardar ambos tokens del backend en el contexto
      await login(
        response.accessToken,
        {
          email: response.user.email,
          name: response.user.fullName,
          emailVerified: response.user.emailVerified,
          role: response.user.role,
        },
        response.refreshToken
      );

      // Mostrar mensaje de éxito
      Alert.alert(
        "¡Registro exitoso!",
        response.user.emailVerified
          ? "Tu cuenta ha sido creada exitosamente."
          : "Te hemos enviado un correo de verificación. Por favor, verifica tu email.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navegar al home después del registro exitoso
              router.push("/(app)/home" as any);
            }
          }
        ]
      );
    } catch (error) {
      console.error("❌ Error en el registro:", error);

      // Manejo específico de errores
      if (error instanceof ApiError) {
        let errorMessage = error.message;

        // Personalizar mensajes según el código de estado
        if (error.statusCode === 409) {
          errorMessage = "Este email ya está registrado. ¿Deseas iniciar sesión en su lugar?";

          Alert.alert(
            "Email ya registrado",
            errorMessage,
            [
              {
                text: "Cancelar",
                style: "cancel"
              },
              {
                text: "Ir a Login",
                onPress: () => router.push("/(auth)/login")
              }
            ]
          );
          return;
        } else if (error.statusCode === 0) {
          errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
        } else if (error.statusCode === 408) {
          errorMessage = "La petición tardó demasiado. Por favor, intenta nuevamente.";
        }

        Alert.alert("Error en el registro", errorMessage);
      } else {
        Alert.alert(
          "Error inesperado",
          "Ocurrió un error al registrar tu cuenta. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Pasamos la función handleBackToLogin al Header */}
      <Header onPress={handleBackToLogin} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.mainTitle}>Crear Cuenta</Text>

          {/* 2. Pasamos la misma función al RegisterForm para el enlace de texto de abajo */}
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            onBackToLogin={handleBackToLogin}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Los estilos de RegisterScreen se mantienen igual
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#094b7eff",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 24,
  },
});
