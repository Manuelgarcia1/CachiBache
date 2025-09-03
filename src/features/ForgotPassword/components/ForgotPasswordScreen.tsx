import React, { useState } from "react";
import { Alert } from "react-native";
import { ScrollView, Stack, Text } from "tamagui";
import { AppLogo } from "../../auth/components/AppLogo";
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
              // Email sent successfully - could navigate back or show success
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
    <Stack 
      flex={1} 
      backgroundColor="$blue8"
      padding="$4"
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack alignItems="center" space="$4" width="100%" marginTop="$8">
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
        </Stack>
      </ScrollView>
    </Stack>
  );
};
