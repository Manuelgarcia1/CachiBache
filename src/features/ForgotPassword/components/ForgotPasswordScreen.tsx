import { AppLogo } from "@features/auth/components/AppLogo";
import { Header } from "@sharedcomponents/index";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ScrollView, Stack, Text } from "tamagui";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const ForgotPasswordScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (email: string) => {
    setLoading(true);

    try {
      // Aquí iría la lógica de envío de email con tu API
      console.log("Enviando email de recuperación a:", email);

      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Si el envío es exitoso
      console.log("Email de recuperación enviado exitosamente");

      Alert.alert(
        "Email Enviado",
        "Hemos enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada.",
        [
          {
            text: "OK",
            onPress: () => {
              // Email sent successfully - navigate back
              router.back();
            },
          },
        ]
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Stack alignItems="center" space="$0" width="100%">
            <AppLogo />
            <Text
              fontSize="$6"
            fontWeight="600"
            color="white"
            textAlign="center"
          >
            ¿Olvidaste tu contraseña?
          </Text>
          <Text
            fontSize="$4"
            color="$blue3"
            textAlign="center"
            maxWidth={300}
          >
            No te preocupes, te ayudamos a recuperarla
          </Text>

          <ForgotPasswordForm onSubmit={handleSubmit} loading={loading} />

          <Button
            size="$4"
            backgroundColor="transparent"
            borderColor="$gray8"
            borderWidth={2}
            color="white"
            fontWeight="600"
            borderRadius="$6"
            pressStyle={{ backgroundColor: "$gray9" }}
            onPress={handleBack}
            width="100%"
            maxWidth={300}
          >
            Volver
          </Button>
        </Stack>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#5eb0ef",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
