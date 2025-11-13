import { useAuth } from "@/src/shared/contexts/AuthContext";
import { Button, ScrollView, Text, YStack, XStack } from "tamagui";
import { ProfileDashboard } from "./ProfileDashboard";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { Feather } from "@expo/vector-icons";

interface User {
  name: string;
  email: string;
  avatar?: string; // Opcional - el backend puede no devolver avatar
  phone?: string;
}

interface ProfileScreenProps {
  user: User;
  reportStats: {
    pendiente: number;
    reparacion: number;
    finalizado: number;
  };
  dashboard: {
    tiempoPromedioPendiente: number;
    tiempoPromedioReparacion: number;
    bachesMes: number[];
    meses: string[];
  };
}

export function ProfileScreen({
  user,
  reportStats,
  dashboard,
}: ProfileScreenProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("❌ Error en logout desde perfil:", error);
    }
  };

  return (
    <YStack flex={1} backgroundColor="#f1f5f9">
      <ProfileHeader name={user.name} email={user.email} avatar={user.avatar || ''} />
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <YStack padding="$4" space="$4">
          {/* Sección de Historial */}
          <YStack space="$3">
            <Text fontSize={20} fontWeight="700" color="#1e293b" letterSpacing={0.3}>
              Historial de Reportes
            </Text>
            <ProfileStats {...reportStats} />
          </YStack>

          {/* Sección de Dashboard */}
          <YStack space="$3">
            <Text fontSize={20} fontWeight="700" color="#1e293b" letterSpacing={0.3}>
              Dashboard
            </Text>
            <ProfileDashboard {...dashboard} />
          </YStack>

          {/* --- SECCIÓN DE OPCIONES --- */}
          <YStack space="$3" marginTop="$3">
            <Text fontSize={18} fontWeight="700" color="#1e293b" marginBottom="$1" letterSpacing={0.3}>
              Opciones de Cuenta
            </Text>

            {/* Botón "Cerrar Sesión" mejorado */}
            <Button
              size="$4"
              backgroundColor="#dc2626"
              color="white"
              fontWeight="600"
              borderRadius="$4"
              pressStyle={{
                backgroundColor: "#b91c1c",
                scale: 0.98,
              }}
              onPress={handleLogout}
              icon={<Feather name="log-out" size={20} color="white" />}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.15}
              shadowRadius={4}
              elevation={3}
            >
              Cerrar Sesión
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
