import { Button } from '@tamagui/button';
import { Stack } from '@tamagui/core';

interface LoginButtonsProps {
  onShowRegister: () => void;
  onShowForgotPassword: () => void;
}

export function LoginButtons({ onShowRegister, onShowForgotPassword }: LoginButtonsProps) {
  return (
    <Stack space="$3" width="100%" maxWidth={300}>
      <Button
        size="$4"
        backgroundColor="$yellow8"
        color="$gray12"
        fontWeight="600"
        borderRadius="$6"
        pressStyle={{ backgroundColor: "$yellow9" }}
        onPress={() => console.log('Login con Google')}
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
        onPress={() => console.log('Login con Correo')}
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
        onPress={onShowRegister}
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
        onPress={onShowForgotPassword}
      >
        ¿Olvidaste tu contraseña?
      </Button>
    </Stack>
  )
}