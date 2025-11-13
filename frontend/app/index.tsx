import { ReauthLoadingScreen } from "@/src/shared/components";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { WelcomeScreen } from "@features/welcome";
import { router } from "expo-router";
import { useEffect } from "react";

// Componente raíz de la app: maneja la navegación inicial según el estado de autenticación
export default function Index() {
  const { token, isLoading, isAdmin } = useAuth();

  // Redirige automáticamente según el rol del usuario
  useEffect(() => {
    if (!isLoading && token) {
      if (isAdmin) {
        router.replace("/(admin)/dashboard" as any);
      } else {
        router.replace("/(app)/home");
      }
    }
  }, [token, isLoading, isAdmin]);

  // Muestra loading mientras se verifica la autenticación
  if (isLoading) {
    if (token) {
      return <ReauthLoadingScreen />;
    } else {
      return null;
    }
  }

  // Evita mostrar WelcomeScreen si hay token durante la navegación
  if (token) {
    return null;
  }

  // Muestra la pantalla de bienvenida si no hay sesión activa
  return <WelcomeScreen />;
}
