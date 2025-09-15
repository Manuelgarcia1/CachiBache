import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Button, ScrollView, Stack, Text } from "tamagui";
import { AppLogo } from "../../auth/components/AppLogo";
import { RegisterForm, RegisterFormData } from "./RegisterForm";

export function RegisterScreen() {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);

    try {
      console.log("Datos del formulario:", formData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Usuario registrado exitosamente");
      // Navegar al home después del registro exitoso
      router.push("/(tabs)" as any);
    } catch (error) {
      console.error("Error en el registro:", error);
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
          padding: 16,
          paddingBottom: 40
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <Stack alignItems="center" space="$4" width="100%" marginTop="$4">
          <AppLogo />
          <Text fontSize="$8" fontWeight="600" color="white" textAlign="center">
            Únete a CachiBache
          </Text>
          <Text fontSize="$4" color="white" textAlign="center" maxWidth={300}>
            Reporta baches en tu ciudad y ayuda a mejorar las calles
          </Text>

          <RegisterForm
            onSubmit={handleRegister}
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
}
