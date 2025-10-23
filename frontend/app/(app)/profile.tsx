import { useEffect, useState } from "react";
import { ProfileScreen } from "@features/profile/components/ProfileScreen";
import { Text } from 'react-native';
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

  useEffect(() => {
    const fetchProfile = async () => {
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
    };

    fetchProfile();
  }, []);

  // Estado de carga
  if (isLoading) {
    return <Text>Cargando perfil...</Text>;
  }

  // Manejo de errores
  if (error) {
    return <Text>Error: {error}</Text>;
  }

  // Validación de datos
  if (!profileData || !profileData.user) {
    return <Text>No se pudo cargar el perfil</Text>;
  }

  // Transformar los datos para ProfileScreen
  return (
    <ProfileScreen
      user={{
        ...profileData.user,
        name: profileData.user.fullName, // Alias para compatibilidad
        avatar: profileData.user.avatar || '', // String vacío si no hay avatar (se maneja en ProfileHeader)
      }}
      reportStats={profileData.reportStats}
      dashboard={profileData.dashboard}
    />
  );
}
