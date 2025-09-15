// Ubicación: app/(tabs)/_layout.tsx

import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ocultamos el título de la pantalla en la parte superior
        tabBarActiveTintColor: '#facc15', // Un amarillo vibrante para el ícono activo
        tabBarInactiveTintColor: '#ffff', // Un gris para los íconos inactivos
        tabBarStyle: {
          backgroundColor: '#094b7eff', // Azul oscuro para el fondo
          borderTopWidth: 0, // Quitamos la línea superior
          height: 100, // Aumentamos un poco la altura si es necesario
          paddingTop:10,
          justifyContent:'center'
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reportar',
          tabBarIcon: ({ color }) => <Feather size={28} name="map-pin" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-reports"
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