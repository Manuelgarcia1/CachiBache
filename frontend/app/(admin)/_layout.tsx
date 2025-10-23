import { useAuth } from "@/src/shared/contexts/AuthContext";
import { Stack, router } from "expo-router";
import { useEffect } from "react";

// Layout de la sección admin: protege rutas y renderiza contenido
export default function AdminLayout() {
  const { token, isLoading, isAdmin } = useAuth();

  // Protección de rutas: redirige si no es admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      console.log("🚫 Acceso denegado - No es admin - Redirigiendo a home");
      router.replace("/(app)/home");
    }
  }, [isAdmin, isLoading]);

  // Previene renderizado durante verificación
  if (isLoading) {
    return null;
  }

  // Previene flash antes del redirect
  if (!isAdmin) {
    return null;
  }

  // Layout con Stack para navegación entre pantallas admin
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="reports" />
    </Stack>
  );
}
