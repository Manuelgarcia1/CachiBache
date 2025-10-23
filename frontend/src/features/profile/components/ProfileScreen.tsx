import { useAuth } from "@/src/shared/contexts/AuthContext";
import { getToken } from "@/src/shared/utils/secure-store";
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
      <ProfileHeader name={user.name} email={user.email} avatar={user.avatar || ''} />
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <YStack padding="$4" space="$5">
          {/* Sección de Historial */}
          <YStack space="$2">
            <Text fontSize="$7" fontWeight="bold" color="#000">
              Historial de Reportes
            </Text>
            <ProfileStats {...reportStats} />
          </YStack>

          {/* Sección de Dashboard */}
          <YStack space="$2">
            <Text fontSize="$7" fontWeight="bold" color="#000">
              Dashboard
            </Text>
            <ProfileDashboard {...dashboard} />
          </YStack>

          {/* --- SECCIÓN DE OPCIONES (CON BOTONES REDISEÑADOS) --- */}
          <YStack space="$3" marginTop="$4">
            <Text fontSize="$6" fontWeight="bold" color="#000" marginBottom="$2">
              Opciones de Cuenta
            </Text>

            {/* Botón "Ver Token" con estilo blanco */}
            <Button
              size="$4"
              color="white"
              fontWeight="bold"
              backgroundColor={"#094b7eff"}
              borderRadius="$10"
              onPress={handleReadToken}
              icon={<Feather name="key" size={18} color="#094b7eff" />}
            >
              Ver Token Actual (Dev)
            </Button>

            {/* Botón "Cerrar Sesión" con estilo amarillo */}
            <Button
              size="$4"
              backgroundColor="$yellow8"
              color="$black"
              fontWeight="bold"
              borderRadius="$10"
              pressStyle={{ backgroundColor: "$yellow9" }}
              onPress={handleLogout}
              icon={<Feather name="log-out" size={18} color="#111827" />}
            >
              Cerrar Sesión
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
