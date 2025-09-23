import { useAuth } from "@/src/shared/contexts/AuthContext";
import { getToken } from "@/src/shared/utils/secure-store";
import { Button, ScrollView, Text, YStack } from "tamagui";
import { ProfileDashboard } from "./ProfileDashboard";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";

interface User {
  name: string;
  email: string;
  avatar: string;
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
      console.log("🚪 Iniciando logout desde perfil...");
      await logout();
      console.log(
        "🔄 AuthContext limpiará token y protección de rutas navegará automáticamente"
      );
    } catch (error) {
      console.error("❌ Error en logout desde perfil:", error);
    }
  };

  const handleReadToken = async () => {
    try {
      console.log("🔍 Leyendo token actual desde perfil...");
      const token = await getToken();
      console.log("🔑 Token actual en perfil:", token);
    } catch (error) {
      console.error("❌ Error leyendo token desde perfil:", error);
    }
  };

  return (
    <YStack flex={1} backgroundColor="#f8fafc">
      <ProfileHeader name={user.name} email={user.email} avatar={user.avatar} />
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <YStack paddingHorizontal="$3" paddingVertical="$3" gap="$3">
          <Text fontSize={30} fontWeight="700" color="#000">
            Historial de reportes
          </Text>
          <ProfileStats {...reportStats} />
          <Text fontSize={30} fontWeight="700" color="#000">
            Dashboard
          </Text>
          <ProfileDashboard {...dashboard} />

          <YStack gap="$3" marginTop="$4">
            <Text fontSize={24} fontWeight="700" color="#000">
              Opciones de cuenta
            </Text>

            <Button
              size="$4"
              backgroundColor="$purple8"
              color="white"
              fontWeight="600"
              borderRadius="$6"
              pressStyle={{ backgroundColor: "$purple9" }}
              onPress={handleReadToken}
            >
              🔍 Ver Token Actual
            </Button>

            <Button
              size="$4"
              backgroundColor="$red8"
              color="white"
              fontWeight="600"
              borderRadius="$6"
              pressStyle={{ backgroundColor: "$red9" }}
              onPress={handleLogout}
            >
              🚪 Cerrar Sesión
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
