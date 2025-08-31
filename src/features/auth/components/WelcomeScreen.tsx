import { Stack } from "@tamagui/core";
import { useState } from "react";
import { ForgotPasswordScreen } from "../../forgot-password/components/ForgotPasswordScreen";
import { RegisterScreen } from "../../register/components/RegisterScreen";
import { AppLogo } from "./AppLogo";
import { GuestOption } from "./GuestOption";
import { LoginButtons } from "./LoginButtons";

export function WelcomeScreen() {
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleBackToWelcome = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  const handleRegisterSuccess = () => {
    // Aquí puedes manejar el registro exitoso
    console.log('Usuario registrado exitosamente');
    setShowRegister(false);
    // Opcional: mostrar mensaje de éxito o navegar a otra pantalla
  };

  const handlePasswordResetSent = () => {
    // Aquí puedes manejar cuando se envía el email de recuperación
    console.log('Email de recuperación enviado');
    setShowForgotPassword(false);
    // Opcional: mostrar mensaje de éxito
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
      />
      <GuestOption />
    </Stack>
  );
}
