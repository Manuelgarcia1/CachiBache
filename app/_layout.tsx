import { useEffect } from "react";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import tamaguiConfig from "@/tamagui.config";
import { AuthProvider } from "@/src/shared/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Solo configurar opciones de splash screen en development builds
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
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} />
            <Stack.Screen name="create-report" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
