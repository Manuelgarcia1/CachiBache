import { ReauthLoadingScreen } from "@/src/shared/components";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { WelcomeScreen } from "@features/auth";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && token) {
      console.log("✅ Usuario autenticado detectado - Navegando a app");
      router.replace("/(app)/home");
    }
  }, [token, isLoading]);

  if (isLoading) {
    if (token) {
      console.log("🔄 Reautenticando usuario existente");
      return <ReauthLoadingScreen />;
    } else {
      console.log("🔄 Loading sin token - primera vez");
      return null; // SplashScreen nativo maneja esto
    }
  }

  // Si hay token pero no estamos en loading, evitar mostrar WelcomeScreen
  if (token) {
    return null; // Navegación en curso
  }

  console.log("📱 Mostrando WelcomeScreen - Usuario no autenticado");
  return <WelcomeScreen />;
}
