import { useEffect, useState } from "react";
import { MyReportsScreen } from "@/src/features/reports/components/my-reports/MyReportsScreen";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { useFocusEffect } from '@react-navigation/native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ReportsTab() {
  const [reports, setReports] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/reports/user`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Respuesta backend:", data); // <-- Agrega esto
    setReports(data.reports || []);
  })
  .catch((err) => {
    console.error("Error al cargar reportes:", err);
    setReports([]);
  });
  }, [token]);

  return <MyReportsScreen reports={reports} />;
}