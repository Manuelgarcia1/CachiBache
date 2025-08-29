import { Stack } from "@tamagui/core";
import { useState } from "react";
import { RegisterScreen } from "../../register/components/RegisterScreen";
import { AppLogo } from "./AppLogo";
import { GuestOption } from "./GuestOption";
import { LoginButtons } from "./LoginButtons";

export function WelcomeScreen() {
  const [showRegister, setShowRegister] = useState(false);

  const handleBackToWelcome = () => {
    setShowRegister(false);
  };

  const handleRegisterSuccess = () => {
    // Aquí puedes manejar el registro exitoso
    console.log('Usuario registrado exitosamente');
    setShowRegister(false);
    // Opcional: mostrar mensaje de éxito o navegar a otra pantalla
  };

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
      <LoginButtons onShowRegister={() => setShowRegister(true)} />
      <GuestOption />
    </Stack>
  );
}
