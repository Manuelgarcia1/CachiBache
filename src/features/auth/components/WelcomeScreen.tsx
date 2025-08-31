import { Stack } from "@tamagui/core";
import { AppLogo } from "./AppLogo";
import { GuestOption } from "./GuestOption";
import { LoginButtons } from "./LoginButtons";

interface WelcomeScreenProps {
  onShowRegister: () => void;
  onShowForgotPassword: () => void;
}

export function WelcomeScreen({ onShowRegister, onShowForgotPassword }: WelcomeScreenProps) {
  // Ya no necesitas los estados showRegister y showForgotPassword aquí
  // Ni la lógica condicional de renderizado para ForgotPasswordScreen o RegisterScreen

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
        onShowRegister={onShowRegister} // Usar la prop recibida
        onShowForgotPassword={onShowForgotPassword} // Usar la prop recibida
      />
      <GuestOption />
    </Stack>
  );
}