import { useEffect } from "react";
import { router } from "expo-router";
import { WelcomeScreen } from "@features/auth";
import { useAuth } from "@/src/shared/contexts/AuthContext";

export default function Index() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && token) {
      console.log('✅ Usuario autenticado detectado - Navegando a app');
      router.replace("/(app)/home");
    }
  }, [token, isLoading]);

  if (isLoading) {
    return null; // SplashScreen maneja el loading
  }

  console.log('📱 Mostrando WelcomeScreen - Usuario no autenticado');
  return <WelcomeScreen />;
}
