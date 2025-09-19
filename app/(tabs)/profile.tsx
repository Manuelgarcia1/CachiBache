import { ProfileScreen } from "@features/profile/components/ProfileScreen";

const user = {
  name: "Juan Pérez",
  email: "juan.perez@email.com",
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
  return (
    <ProfileScreen
      user={user}
      reportStats={reportStats}
      dashboard={dashboard}
    />
  );
}
