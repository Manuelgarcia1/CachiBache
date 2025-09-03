import React, { useState } from "react";
import { ScrollView, Stack, Text } from "tamagui";
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
    } catch (error) {
      console.error("Error en el registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack flex={1} backgroundColor="$blue8" padding="$4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack alignItems="center" space="$4" width="100%" marginTop="$8">
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
        </Stack>
      </ScrollView>
    </Stack>
  );
}
