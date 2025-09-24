// Ubicación: src/features/auth/components/WelcomeScreen.tsx

import { Stack } from "tamagui";
import { AppLogo } from "./AppLogo";
import { GuestOption } from "./GuestOption";
import { LoginButtons } from "./LoginButtons";

export function WelcomeScreen() {
  return (
    <Stack
      flex={1}
      backgroundColor="#094b7eff"
      justifyContent="center"
      alignItems="center"
      padding="$4"
    >
      <AppLogo />
      <LoginButtons />
      <GuestOption />
    </Stack>
  );
}
