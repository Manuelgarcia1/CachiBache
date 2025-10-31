import { AppLogo } from "@features/welcome/components/AppLogo";
import { authService } from "@/src/shared/services/auth.service";
import { Header } from "@sharedcomponents/index"; // Usamos alias
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, YStack } from "tamagui"; // CAMBIO: Usamos YStack
import { ForgotPasswordForm } from "./ForgotPasswordForm"; // Usamos ruta relativa limpia

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
      const response = await authService.forgotPassword({ email });
      Alert.alert("Revisa tu email", response.message, [
        { text: "OK", onPress: handleBack },
      ]);
    } catch (error: any) {
      console.error("Error al enviar email de recuperación:", error);
      Alert.alert(
        "Error",
        error.message ||
          "No pudimos enviar el email de recuperación. Por favor, intenta nuevamente."
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
          {/* --- CAMBIOS DE ESTRUCTURA AQUÍ --- */}
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            width="100%"
            space="$4"
          >
            <AppLogo size={250} />

            {/* ELIMINADOS los Text duplicados que estaban aquí */}

            <ForgotPasswordForm onSubmit={handleSubmit} loading={loading} />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Los estilos se mantienen simples ya que Tamagui maneja el layout
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#094b7eff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
});
