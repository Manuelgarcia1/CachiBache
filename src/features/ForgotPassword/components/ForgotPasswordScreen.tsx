import { AppLogo } from "@features/auth/components/AppLogo";
import { Header } from "@sharedcomponents/index"; // Usamos alias
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, YStack } from "tamagui"; // CAMBIO: Usamos YStack
import { ForgotPasswordForm } from "./ForgotPasswordForm"; // Usamos ruta relativa limpia

export const ForgotPasswordScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleSubmit = async (email: string) => {
    setLoading(true);
    try {
      console.log("Enviando email de recuperación a:", email);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Email de recuperación enviado exitosamente");

      Alert.alert(
        "Email Enviado",
        "Hemos enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada.",
        [{ text: "OK", onPress: handleBack }]
      );
    } catch (error) {
      console.error("Error al enviar email de recuperación:", error);
      Alert.alert(
        "Error",
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
          <YStack flex={1} justifyContent="center" alignItems="center" width="100%" space="$4">
            <AppLogo size={250} /> 
            
            {/* ELIMINADOS los Text duplicados que estaban aquí */}

            <ForgotPasswordForm 
              onSubmit={handleSubmit} 
              loading={loading}
            />
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