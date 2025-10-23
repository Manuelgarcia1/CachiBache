// Sidebar de navegación para admin
import { useState } from 'react';
import { YStack, Text, Button, XStack } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useAuth } from '@/src/shared/contexts/AuthContext';
import { TouchableOpacity } from 'react-native';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigation = (href: string) => {
    router.push(href as any);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <YStack
      width={isCollapsed ? 72 : 240}
      backgroundColor="#094b7e"
      padding={isCollapsed ? '$2' : '$4'}
      gap="$3"
      height="100%"
      style={{ transition: 'width 0.3s ease' }}
    >
      {/* Header con botón de colapsar */}
      <XStack
        justifyContent={isCollapsed ? 'center' : 'space-between'}
        alignItems="center"
        paddingBottom="$3"
        borderBottomWidth={1}
        borderBottomColor="rgba(255,255,255,0.1)"
      >
        {!isCollapsed && (
          <YStack gap="$1">
            <Text fontSize={18} fontWeight="bold" color="#fff">
              Admin Panel
            </Text>
            <Text fontSize={11} color="rgba(255,255,255,0.7)" numberOfLines={1}>
              {user?.name}
            </Text>
          </YStack>
        )}
        <TouchableOpacity onPress={toggleSidebar}>
          <Feather
            name={isCollapsed ? 'chevron-right' : 'chevron-left'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </XStack>

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
              justifyContent={isCollapsed ? 'center' : 'flex-start'}
              paddingHorizontal={isCollapsed ? '$2' : '$3'}
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
              {!isCollapsed && item.label}
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
        justifyContent={isCollapsed ? 'center' : 'flex-start'}
        paddingHorizontal={isCollapsed ? '$2' : '$3'}
        icon={<Feather name="log-out" size={20} color="#fff" />}
      >
        {!isCollapsed && 'Cerrar Sesión'}
      </Button>
    </YStack>
  );
}
