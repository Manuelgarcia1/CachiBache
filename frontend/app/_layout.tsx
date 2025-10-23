import { useEffect } from "react";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import tamaguiConfig from "@/tamagui.config";
import { AuthProvider } from "@/src/shared/contexts/AuthContext";

// Previene que el splash screen se oculte automáticamente (control manual desde AuthContext)
SplashScreen.preventAutoHideAsync();

// Layout raíz: configura todos los providers y la estructura de navegación de la app
export default function RootLayout() {
  useEffect(() => {
    // Configura duración y fade del splash solo en development builds (no en Expo Go)
    if (!Constants.expoConfig?.extra?.isExpoGo) {
      SplashScreen.setOptions({
        duration: 1000,
        fade: true,
      });
    }
  }, []);

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
