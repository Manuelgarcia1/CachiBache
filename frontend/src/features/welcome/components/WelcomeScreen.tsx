import { Stack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLogo } from "./AppLogo";
import { GuestOption } from "./GuestOption";
import { LoginButtons } from "./LoginButtons";

// Pantalla de bienvenida: primera pantalla que ven usuarios sin sesión activa
export function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Stack
      flex={1}
      backgroundColor="#094b7eff"
      justifyContent="center"
      alignItems="center"
      paddingHorizontal="$4"
      paddingTop="$4"
      paddingBottom={insets.bottom + 16} // Espacio para botones del sistema + margen
    >
      <AppLogo />
      <LoginButtons />
      <GuestOption />
    </Stack>
  );
}
