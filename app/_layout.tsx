// Ubicación: app/_layout.tsx
import { Stack } from "expo-router";
import { TamaguiProvider } from '@tamagui/core'; // <-- Asegúrate que sea de @tamagui/core
import config from '../tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TamaguiProvider>
  );
}