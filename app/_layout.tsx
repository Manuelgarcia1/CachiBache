import { Stack } from "expo-router";
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import config from '../tamagui.config'

const tamaguiConfig = createTamagui(config)

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </TamaguiProvider>
  );
}