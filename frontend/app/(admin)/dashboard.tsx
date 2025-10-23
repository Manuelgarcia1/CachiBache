import { Text, YStack } from "tamagui";
import { useAuth } from "@/src/shared/contexts/AuthContext";

export default function DashboardAdmin() {
  const { user, logout } = useAuth();

  return (
    <YStack flex={1} padding="$4" backgroundColor="#f8fafc">
      <Text fontSize={32} fontWeight="bold" marginBottom="$4">
        Dashboard Admin
      </Text>
      <Text fontSize={18} marginBottom="$2">
        Bienvenido, {user?.name}
      </Text>
      <Text fontSize={14} color="$gray10" marginBottom="$4">
        Email: {user?.email}
      </Text>
      <Text fontSize={14} color="$gray10" marginBottom="$4">
        Rol: {user?.role}
      </Text>
      <Text fontSize={16} marginTop="$6" color="$blue10">
        🚧 Panel de administración en construcción...
      </Text>
    </YStack>
  );
}
