import { AppLogo } from "@features/welcome/components/AppLogo";
import { Header } from "@sharedcomponents/index";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, YStack } from "tamagui";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { authService } from "@/src/shared/services/auth.service";

export const ForgotPasswordScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleSubmit = async (email: string) => {
    setLoading(true);
    try {
      const response = await authService.requestPasswordReset(email);

      Alert.alert(
        "Código Enviado",
        "Hemos enviado un código de 6 dígitos a tu email. Ingresa el código para restablecer tu contraseña.",
        [
          { text: "OK" },
          {
            text: "Ingresar código",
            onPress: () => router.navigate("/reset-password")
          }
        ]
      );
    } catch (error: any) {
      console.error("Error al enviar email de recuperación:", error);
      Alert.alert(
        "Error",
        error.message || "No pudimos enviar el email de recuperación. Por favor, intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onPress={handleBack} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            width="100%"
            space="$3"
          >
            <AppLogo size={250} />

            <ForgotPasswordForm onSubmit={handleSubmit} loading={loading} />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#094b7eff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
});
