import { useEffect, useState } from "react";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { ProfileScreen } from "@features/profile/components/ProfileScreen";
import { Text } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileTab() {
  const { token } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
  if (!token) return;

  fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
        if (data && data.user) {
          setProfileData({
            ...data,
            user: {
              ...data.user,
              name: data.user.fullName,
            },
          });
        }
      })
    .catch((err) => {
      console.error("Error al cargar perfil:", err);
      setProfileData(null);
    });
}, [token]);

  if (!profileData || !profileData.user) {
  return <Text>Cargando perfil...</Text>; // O un loader
}

return (
  <ProfileScreen
    user={profileData.user}
    reportStats={profileData.reportStats}
    dashboard={profileData.dashboard}
  />
);
}
