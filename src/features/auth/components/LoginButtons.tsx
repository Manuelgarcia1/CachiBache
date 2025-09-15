// Ubicación: src/features/auth/components/LoginButtons.tsx

import { router } from "expo-router";
import { Button, Stack } from "tamagui";

export function LoginButtons() {
  return (
    <Stack space="$3" width="100%" maxWidth={300}>
      <Button
        size="$4"
        backgroundColor="$yellow8"
        color="$gray12"
        fontWeight="600"
        borderRadius="$6"
        pressStyle={{ backgroundColor: "$yellow9" }}
        onPress={() => {}}
      >
        Ingresar con Google
      </Button>

      <Button
        size="$4"
        backgroundColor="transparent"
        borderColor="$blue3"
        borderWidth={2}
        color="white"
        fontWeight="600"
        borderRadius="$6"
        pressStyle={{ backgroundColor: "$blue9" }}
        onPress={() => router.push("/(tabs)" as any)}
      >
        Ingresar con Correo
      </Button>

      <Button
        size="$4"
        backgroundColor="transparent"
        borderColor="$green8"
        borderWidth={2}
        color="white"
        fontWeight="600"
        borderRadius="$6"
        pressStyle={{ backgroundColor: "$green9" }}
        onPress={() => router.push("/register")}
      >
        Crear Cuenta Nueva
      </Button>

      <Button
        size="$4"
        backgroundColor="transparent"
        borderColor="$orange8"
        borderWidth={2}
        color="white"
        fontWeight="600"
        borderRadius="$6"
        pressStyle={{ backgroundColor: "$orange9" }}
        onPress={() => router.push("/ForgotPassword")}
      >
        ¿Olvidaste tu contraseña?
      </Button>
    </Stack>
  );
}
