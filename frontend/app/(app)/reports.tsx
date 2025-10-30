import { useCallback, useState } from "react";
import { MyReportsScreen } from "@/src/features/reports/components/my-reports/MyReportsScreen";
import { useFocusEffect } from '@react-navigation/native';
import { getUserReports } from "@/src/shared/services/reports.service";

export default function ReportsTab() {
  const [reports, setReports] = useState([]);

  const fetchReports = useCallback(async () => {
    try {
      const data = await getUserReports();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error al cargar reportes:", err);
      setReports([]);
    }
  }, []);

  // Recargar reportes cada vez que la pantalla recibe focus
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [fetchReports])
  );

  return <MyReportsScreen reports={reports} />;
}