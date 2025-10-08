import { useAuth } from "@/src/shared/contexts/AuthContext";
import { AppLogo } from "@features/welcome";
import { Header } from "@sharedcomponents/index";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Stack, Text } from "tamagui";

// Pantalla de login con email: formulario de autenticación con email y contraseña
export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Maneja el login con email: valida campos y genera token mock
  const handleEmailLogin = async () => {
    if (!email || !password) {
      console.log("⚠️ Email y contraseña son requeridos");
      return;
    }

    setLoading(true);
    console.log("📧 Iniciando login con email...");
    console.log("👤 Email:", email);

    try {
      const mockToken = `email-${Date.now()}`;
      console.log("🔑 Generando token mock para email:", mockToken);

      await login(mockToken, { email, name: email.split("@")[0] });

      console.log("✅ Login exitoso - Navegando a la app");
    } catch (error) {
      console.error("❌ Error en login con email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#094b7eff" }}>
      <Header onPress={handleBack} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Stack
          flex={1}
          backgroundColor="#094b7eff"
          justifyContent="center"
          alignItems="center"
          padding="$4"
          space="$4"
        >
          <AppLogo />

          <Text fontSize="$6" fontWeight="600" color="white" textAlign="center">
            Ingresar con Email
          </Text>

          <Stack space="$3" width="100%" maxWidth={300}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              size="$4"
              backgroundColor="white"
            />

            <Input
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              size="$4"
              backgroundColor="white"
            />

            <Button
              size="$4"
              backgroundColor="$yellow8"
              color="$gray12"
              fontWeight="600"
              borderRadius="$6"
              pressStyle={{ backgroundColor: "$yellow9" }}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </Stack>
        </Stack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
