// Ubicación: src/features/auth/components/WelcomeScreen.tsx

import { Stack } from "@tamagui/core";
import { useState } from "react";
import { router } from 'expo-router'; // <-- 1. IMPORTA EL ROUTER
import { ForgotPasswordScreen } from "../../forgot-password/components/ForgotPasswordScreen";
import { RegisterScreen } from "../../register/components/RegisterScreen";
import { AppLogo } from "./AppLogo";
import { GuestOption } from "./GuestOption";
import { LoginButtons } from "./LoginButtons";

export function WelcomeScreen() {
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // 2. CREA LA FUNCIÓN QUE NAVEGA
  const handleLogin = () => {
    // Esto reemplaza la pantalla actual con la ruta raíz del grupo (tabs)
    router.replace('/(tabs)'); 
  };

  const handleBackToWelcome = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  const handleRegisterSuccess = () => {
    console.log('Usuario registrado exitosamente');
    setShowRegister(false);
    // Opcional: navegar al home después del registro exitoso
    router.replace('/(tabs)');
  };

  const handlePasswordResetSent = () => {
    console.log('Email de recuperación enviado');
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordScreen
        onPasswordResetSent={handlePasswordResetSent}
        onBackToLogin={handleBackToWelcome}
      />
    );
  }

  if (showRegister) {
    return (
      <RegisterScreen
        onRegisterSuccess={handleRegisterSuccess}
        onBackToLogin={handleBackToWelcome}
      />
    );
  }

  return (
    <Stack
      flex={1}
      backgroundColor="$blue8"
      justifyContent="center"
      alignItems="center"
      padding="$4"
    >
      <AppLogo />
      <LoginButtons 
        onShowRegister={() => setShowRegister(true)}
        onShowForgotPassword={() => setShowForgotPassword(true)}
        onLogin={handleLogin} // <-- 3. PASA LA FUNCIÓN AL COMPONENTE
      />
      <GuestOption />
    </Stack>
  );
}