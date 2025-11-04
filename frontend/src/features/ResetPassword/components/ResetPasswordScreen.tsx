import { AppLogo } from "@features/welcome/components/AppLogo";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, YStack, Text, Input } from "tamagui";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { authService } from "@/src/shared/services/auth.service";

export const ResetPasswordScreen: React.FC = () => {
  const params = useLocalSearchParams<{ token?: string }>();
  const [token, setToken] = useState(params.token || "");
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [manualMode, setManualMode] = useState(!params.token);

  // Validar token al montar el componente (solo si viene por parámetro)
  useEffect(() => {
    const validateToken = async () => {
      if (!token || manualMode) {
        setValidatingToken(false);
        return;
      }

      setValidatingToken(true);
      try {
        const response = await authService.validateResetToken(token);
        setTokenValid(response.valid);

        if (!response.valid) {
          Alert.alert(
            "Código Inválido",
            "El código de recuperación ha expirado o es inválido. Por favor, solicita uno nuevo.",
            [{ text: "OK", onPress: () => router.replace("/forgot-password") }]
          );
        }
      } catch (error: any) {
        console.error("Error validando token:", error);
        Alert.alert(
          "Error",
          "No pudimos validar el código de recuperación. Por favor, intenta nuevamente.",
          [{ text: "OK", onPress: () => router.replace("/forgot-password") }]
        );
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [params.token]);

  const handleSubmit = async (newPassword: string, confirmPassword: string) => {
    if (!token) {
      Alert.alert("Error", "Código de recuperación no encontrado");
      return;
    }

    setLoading(true);
    try {
      console.log("Restableciendo contraseña...");
      const response = await authService.resetPassword(
        token,
        newPassword,
        confirmPassword
      );
      console.log("Contraseña restablecida exitosamente");

      Alert.alert(
        "Contraseña Actualizada",
        response.message || "Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
    } catch (error: any) {
      console.error("Error al restablecer contraseña:", error);
      Alert.alert(
        "Error",
        error.message || "No pudimos restablecer tu contraseña. Por favor, intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <YStack
              width="100%"
              space="$4"
              paddingTop="$2"
              minHeight="100%"
            >
              <YStack alignItems="center" marginTop="$4" marginBottom="$3">
                <AppLogo size={250} />
              </YStack>

            {validatingToken ? (
              <YStack space="$4" alignItems="center" paddingVertical="$8">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text color="#ffffff" fontSize="$5" fontWeight="500">
                  Validando código de recuperación...
                </Text>
              </YStack>
            ) : (
              <YStack width="100%" space="$4" paddingHorizontal="$4">
                {manualMode && (
                  <YStack space="$2">
                    <Text color="#ffffff" fontSize="$6" fontWeight="600" textAlign="center" marginBottom="$3">
                      Ingresa tu código de recuperación
                    </Text>
                    <Input
                      placeholder="Código de 6 dígitos"
                      placeholderTextColor="#999"
                      value={token}
                      onChangeText={setToken}
                      autoCapitalize="none"
                      keyboardType="numeric"
                      maxLength={6}
                      width="100%"
                      height={55}
                      backgroundColor="$white"
                      borderRadius="$6"
                      paddingHorizontal="$5"
                      fontSize="$4"
                    />
                  </YStack>
                )}
                {token && <ResetPasswordForm onSubmit={handleSubmit} loading={loading} />}
              </YStack>
            )}
            </YStack>
          </TouchableWithoutFeedback>
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
    padding: 20,
    paddingBottom: 100,
  },
});
