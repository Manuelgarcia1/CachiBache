import { useAuth } from "@/src/shared/contexts/AuthContext";
import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Text } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Layout de la sección admin: protege rutas y renderiza contenido con tabs inferiores
export default function AdminLayout() {
  const { isLoading, isAdmin, logout } = useAuth();
  const insets = useSafeAreaInsets();

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

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  // Layout con Tabs inferiores
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#094b7e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#facc15",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#094b7e",
          borderTopColor: "rgba(255,255,255,0.1)",
          borderTopWidth: 1,
          paddingBottom: insets.bottom, // Respeta los botones de navegación de Android
          height: 60 + insets.bottom, // Altura base + espacio para botones del sistema
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 16 }}
            >
              <Feather name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reportes",
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 16 }}
            >
              <Feather name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
