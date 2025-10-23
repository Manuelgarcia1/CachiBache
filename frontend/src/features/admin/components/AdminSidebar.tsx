// Sidebar de navegación para admin
import { YStack, Text, Button } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useAuth } from '@/src/shared/contexts/AuthContext';

interface MenuItem {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  href: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    icon: 'bar-chart-2',
    label: 'Dashboard',
    href: '/(admin)/dashboard' as any,
  },
  {
    icon: 'file-text',
    label: 'Reportes',
    href: '/(admin)/reports' as any,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleNavigation = (href: string) => {
    router.push(href as any);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <YStack
      width={250}
      backgroundColor="#094b7e"
      padding="$4"
      gap="$4"
      height="100%"
    >
      {/* Header */}
      <YStack gap="$2" paddingBottom="$4" borderBottomWidth={1} borderBottomColor="rgba(255,255,255,0.1)">
        <Text fontSize={20} fontWeight="bold" color="#fff">
          Admin Panel
        </Text>
        <Text fontSize={12} color="rgba(255,255,255,0.7)">
          {user?.name}
        </Text>
      </YStack>

      {/* Menu Items */}
      <YStack gap="$2" flex={1}>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              onPress={() => handleNavigation(item.href)}
              backgroundColor={isActive ? '#facc15' : 'transparent'}
              color={isActive ? '#000' : '#fff'}
              justifyContent="flex-start"
              icon={
                <Feather
                  name={item.icon}
                  size={20}
                  color={isActive ? '#000' : '#fff'}
                />
              }
              pressStyle={{
                backgroundColor: isActive ? '#facc15' : 'rgba(255,255,255,0.1)',
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </YStack>

      {/* Logout */}
      <Button
        onPress={handleLogout}
        backgroundColor="transparent"
        color="#fff"
        borderWidth={1}
        borderColor="rgba(255,255,255,0.3)"
        justifyContent="flex-start"
        icon={<Feather name="log-out" size={20} color="#fff" />}
      >
        Cerrar Sesión
      </Button>
    </YStack>
  );
}
