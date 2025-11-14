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
          backgroundColor="#ffffff"
          paddingHorizontal="$4"
          paddingTop="$4"
          paddingBottom={insets.bottom + 12}
          justifyContent="center"
          alignItems="center"
          gap="$3"
          borderTopWidth={1}
          borderTopColor="#e5e5e5"
          shadowColor="#000"
          shadowOffset={{ width: 0, height: -2 }}
          shadowOpacity={0.08}
          shadowRadius={4}
        >
          <XStack alignItems="center" gap="$2">
            <Feather name="user-x" size={18} color="#666" />
            <Text color="#333" fontSize={13} fontWeight="600">
              Navegando como invitado
            </Text>
          </XStack>

          <Button
            size="$3"
            color="#fff"
            backgroundColor="#3483fa"
            fontWeight="700"
            borderRadius="$3"
            paddingHorizontal="$6"
            pressStyle={{ backgroundColor: "#2968c8", opacity: 0.9 }}
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

  // Navegación completa por tabs para usuarios registrados - Estilo profesional
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3483fa", // Azul profesional tipo Mercado Libre
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e5e5",
          borderTopWidth: 1,
          paddingTop: 8,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 11,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Reportar",
          tabBarIcon: ({ color }) => (
            <Feather size={24} name="map-pin" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Mis Reportes",
          tabBarIcon: ({ color }) => (
            <Feather size={24} name="file-text" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Feather size={24} name="user" color={color} />
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
