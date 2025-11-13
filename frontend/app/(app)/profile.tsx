import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { ProfileScreen } from "@features/profile/components/ProfileScreen";
import { YStack, Text, Spinner } from 'tamagui';
import { apiService } from "@/src/shared/services/api.service";

/**
 * Tipos para la respuesta del endpoint /users/me
 */
interface ProfileData {
  user: {
    id: string;
    email: string;
    fullName: string;
    isEmailVerified: boolean;
    avatar?: string;
  };
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

export default function ProfileTab() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Usar apiService en lugar de fetch nativo
      // El token se agrega automáticamente vía interceptor (api.service.ts:40-63)
      const data = await apiService.get<ProfileData>('/users/me');

      setProfileData(data);
    } catch (err: any) {
      console.error("Error al cargar perfil:", err);
      setError(err.message || 'No se pudo cargar el perfil');
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Recargar perfil cada vez que la pantalla recibe focus
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  // Estado de carga
  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#f8fafc">
        <Spinner size="large" color="$yellow9" />
      </YStack>
    );
  }

  // Manejo de errores
  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#f8fafc" padding="$4">
        <Text fontSize="$5" color="$red10" textAlign="center">Error: {error}</Text>
      </YStack>
    );
  }

  // Validación de datos
  if (!profileData || !profileData.user) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#f8fafc" padding="$4">
        <Text fontSize="$5" color="$gray11" textAlign="center">No se pudo cargar el perfil</Text>
      </YStack>
    );
  }

  // Transformar los datos para ProfileScreen
  return (
    <ProfileScreen
      user={{
        name: profileData.user.fullName, // Nombre completo
        email: profileData.user.email,   // Email
        avatar: profileData.user.avatar || '', // String vacío si no hay avatar (se maneja en ProfileHeader)
      }}
      reportStats={profileData.reportStats}
      dashboard={profileData.dashboard}
    />
  );
}
