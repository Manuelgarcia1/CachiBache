import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Button, ScrollView, Stack, Text } from "tamagui";
import { AppLogo } from "@features/auth/components/AppLogo";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const ForgotPasswordScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

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
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack flex={1} backgroundColor="$blue8">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <Stack alignItems="center" space="$4" width="100%" marginTop="$4">
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

          <ForgotPasswordForm
            onSubmit={handleSubmit}
            loading={loading}
          />

          <Button
            size="$4"
            backgroundColor="transparent"
            borderColor="$gray8"
            borderWidth={2}
            color="white"
            fontWeight="600"
            borderRadius="$6"
            pressStyle={{ backgroundColor: "$gray9" }}
            onPress={() => router.back()}
            width="100%"
            maxWidth={300}
          >
            Volver
          </Button>
        </Stack>
      </ScrollView>
      </Stack>
    </KeyboardAvoidingView>
  );
};
