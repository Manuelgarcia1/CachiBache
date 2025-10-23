import { useAuth } from "@/src/shared/contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import { Button, Text, XStack, YStack } from "tamagui";

// Layout de la sección autenticada: maneja navegación por tabs y protege rutas privadas
export default function AppLayout() {
  const { token, isLoading, isGuest, isAdmin, logout } = useAuth();

  // Protección de rutas: redirige a dashboard si es admin
  useEffect(() => {
    if (!isLoading && isAdmin) {
      console.log("🔀 Admin detectado - Redirigiendo a dashboard");
      router.replace("/(admin)/dashboard");
    }
  }, [isAdmin, isLoading]);

  // Protección de rutas: redirige a inicio si no hay token válido
  useEffect(() => {
    if (!isLoading && !token) {
      console.log("🚫 Acceso denegado - No hay token - Redirigiendo a inicio");
      router.replace("/");
    }
  }, [token, isLoading]);

  // Previene renderizado durante verificación de autenticación
  if (isLoading) {
    return null;
  }

  // Previene flash de contenido antes del redirect
  if (!token) {
    return null;
  }

  // UI especial para usuarios invitados: sin tabs, solo home + banner de registro
  if (isGuest) {
    return (
      <YStack flex={1}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          <Tabs.Screen name="home" />
        </Tabs>

        <YStack
          backgroundColor="#094b7eff"
          height={120}
          paddingHorizontal="$4"
          paddingVertical="$3"
          justifyContent="center"
          alignItems="center"
          gap="$2"
          paddingBottom="$8"
        >
          <XStack alignItems="center" gap="$2">
            <Feather name="user-x" size={20} color="#facc15" />
            <Text color="#ffffff" fontSize="$3" fontWeight="500">
              Navegando como invitado
            </Text>
          </XStack>

          <Button
            size="$4"
            color="#000"
            backgroundColor="#facc15"
            fontWeight="600"
            borderRadius="$4"
            onPress={() => {
              logout();
              router.replace("/");
            }}
          >
            Iniciar Sesión
          </Button>
        </YStack>
      </YStack>
    );
  }

  // Navegación completa por tabs para usuarios registrados
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#facc15",
        tabBarInactiveTintColor: "#ffffff",
        tabBarStyle: {
          backgroundColor: "#094b7eff",
          borderTopWidth: 0,
          height: 100,
          paddingTop: 10,
          justifyContent: "center",
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Reportar",
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="map-pin" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Mis Reportes",
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="file-text" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-report"
        options={{
          href: null, // Ocultar de tabs
        }}
      />
    </Tabs>
  );
}
