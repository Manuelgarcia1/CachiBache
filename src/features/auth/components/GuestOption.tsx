import { Text, Stack } from '@tamagui/core'

export function GuestOption() {
  return (
    <Stack marginTop="$6">
      <Text 
        color="$blue3" 
        fontSize="$4" 
        textDecorationLine="underline"
        onPress={() => console.log('Ingresar como invitado')}
      >
        Ingresar como Invitado
      </Text>
    </Stack>
  )
}