import { Stack } from '@tamagui/core'
import { Button } from '@tamagui/button'

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
    </Stack>
  )
}