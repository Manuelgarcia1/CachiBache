import { useAuth } from "@/src/shared/contexts/AuthContext";
import { ProfileScreen } from "@features/profile/components/ProfileScreen";

const defaultUser = {
  name: "Usuario",
  email: "usuario@email.com",
  avatar: "https://randomuser.me/api/portraits/men/4.jpg",
};

const reportStats = {
  pendiente: 3,
  reparacion: 2,
  finalizado: 5,
};

const dashboard = {
  tiempoPromedioPendiente: 8,
  tiempoPromedioReparacion: 12,
  bachesMes: [4, 7, 3, 6, 5, 8],
  meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
};

export default function ProfileTab() {
  const { user: authUser } = useAuth();

  const user = {
    name: authUser?.name || defaultUser.name,
    email: authUser?.email || defaultUser.email,
    avatar: defaultUser.avatar,
  };

  return (
    <ProfileScreen
      user={user}
      reportStats={reportStats}
      dashboard={dashboard}
    />
  );
}
