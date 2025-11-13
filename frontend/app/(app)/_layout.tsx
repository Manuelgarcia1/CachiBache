import { useAuth } from "@/src/shared/contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import { Button, Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Layout de la sección autenticada: maneja navegación por tabs y protege rutas privadas
export default function AppLayout() {
  const { token, isLoading, isGuest, isAdmin, logout } = useAuth();
  const insets = useSafeAreaInsets();

  // Protección de rutas: redirige a dashboard si es admin
  useEffect(() => {
    if (!isLoading && isAdmin) {
      router.replace("/(admin)/dashboard" as any);
    }
  }, [isAdmin, isLoading]);

  // Protección de rutas: redirige a inicio si no hay token válido
  useEffect(() => {
    if (!isLoading && !token) {
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
          paddingHorizontal="$4"
          paddingTop="$3"
          paddingBottom={insets.bottom + 16} // Espacio para botones del sistema + margen
          justifyContent="center"
          alignItems="center"
          gap="$2"
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
          paddingTop: 10,
          height: 80 + insets.bottom, // Altura base + espacio para botones del sistema
          paddingBottom: insets.bottom, // Respeta los botones de navegación de Android
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
