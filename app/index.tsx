import { ReauthLoadingScreen } from "@/src/shared/components";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { WelcomeScreen } from "@features/welcome";
import { router } from "expo-router";
import { useEffect } from "react";

// Componente raíz de la app: maneja la navegación inicial según el estado de autenticación
export default function Index() {
  const { token, isLoading } = useAuth();

  // Redirige automáticamente a home si el usuario ya está autenticado
  useEffect(() => {
    if (!isLoading && token) {
      console.log("✅ Usuario autenticado detectado - Navegando a app");
      router.replace("/(app)/home");
    }
  }, [token, isLoading]);

  // Muestra loading mientras se verifica la autenticación
  if (isLoading) {
    if (token) {
      console.log("🔄 Reautenticando usuario existente");
      return <ReauthLoadingScreen />;
    } else {
      console.log("🔄 Loading sin token - primera vez");
      return null;
    }
  }

  // Evita mostrar WelcomeScreen si hay token durante la navegación
  if (token) {
    return null;
  }

  // Muestra la pantalla de bienvenida si no hay sesión activa
  console.log("📱 Mostrando WelcomeScreen - Usuario no autenticado");
  return <WelcomeScreen />;
}
