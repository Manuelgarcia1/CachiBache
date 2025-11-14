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

  // Layout con Tabs inferiores - Estilo profesional
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
        tabBarActiveTintColor: "#3483fa",
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e5e5",
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: insets.bottom + 6,
          height: 65 + insets.bottom,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Feather name="bar-chart-2" size={24} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 16 }}
            >
              <Feather name="log-out" size={22} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reportes",
          tabBarIcon: ({ color }) => (
            <Feather name="file-text" size={24} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 16 }}
            >
              <Feather name="log-out" size={22} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
