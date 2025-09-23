import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { useAuth } from '@/src/shared/contexts/AuthContext';

export default function AppLayout() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      console.log('🚫 Acceso denegado - No hay token - Redirigiendo a inicio');
      router.replace('/');
    }
  }, [token, isLoading]);

  if (isLoading) {
    return null; // Mostrar loading mientras verifica
  }

  if (!token) {
    return null; // Prevenir flash antes del redirect
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#facc15',
        tabBarInactiveTintColor: '#ffffff',
        tabBarStyle: {
          backgroundColor: '#094b7eff',
          borderTopWidth: 0,
          height: 100,
          paddingTop: 10,
          justifyContent: 'center'
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Reportar',
          tabBarIcon: ({ color }) => <Feather size={28} name="map-pin" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Mis Reportes',
          tabBarIcon: ({ color }) => <Feather size={28} name="file-text" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Feather size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}