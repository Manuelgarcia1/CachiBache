import { useCallback, useState } from "react";
import { MyReportsScreen } from "@/src/features/reports/components/my-reports/MyReportsScreen";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { useFocusEffect } from '@react-navigation/native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ReportsTab() {
  const [reports, setReports] = useState([]);
  const { token } = useAuth();

  const fetchReports = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/reports/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error al cargar reportes:", err);
      setReports([]);
    }
  }, [token]);

  // Recargar reportes cada vez que la pantalla recibe focus
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [fetchReports])
  );

  return <MyReportsScreen reports={reports} />;
}