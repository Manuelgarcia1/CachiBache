import { useState, useEffect, useCallback } from "react";
import { ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { YStack, Text, Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { ReportTable } from "./ReportTable";
import { ReportFilters } from "./ReportFilters";
import { ChangeStatusModal } from "./ChangeStatusModal";
import { ExportPDFModal, ExportFilters } from "./ExportPDFModal";
import {
  getAllReportsAdmin,
  updateReportStatus,
  exportReportsPDF,
} from "@/src/shared/services/admin.service";
import {
  ReportFromBackend,
  ReportStatus,
} from "@/src/shared/types/report.types";
import { API_BASE_URL } from "@/src/shared/config/api";
import { getToken } from "@/src/shared/utils/secure-store";

export function ReportsScreen() {
  // Estado de datos
  const [reports, setReports] = useState<ReportFromBackend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);

  // Estado de filtros
  const [statusFilter, setStatusFilter] = useState<ReportStatus | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Estado del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<ReportFromBackend | null>(null);

  // Estado del modal de exportar PDF
  const [exportModalVisible, setExportModalVisible] = useState(false);

  // Función para cargar reportes
  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllReportsAdmin({
        page: currentPage,
        limit: 20,
        status: statusFilter,
        search: searchQuery || undefined,
      });

      setReports(response.reports);
      setTotalReports(response.total);
      setTotalPages(Math.ceil(response.total / 20));
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("Error al cargar los reportes");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  // Cargar reportes cuando cambien los filtros o la página
  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Handlers
  const handleStatusChange = (status: ReportStatus | undefined) => {
    if (status === undefined || (status as any) === "all") {
      setStatusFilter(undefined);
    } else {
      setStatusFilter(status);
    }
    setCurrentPage(1); // Resetear a la primera página
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1); // Resetear a la primera página
  };

  const handleClearFilters = () => {
    setStatusFilter(undefined);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleEditStatus = (report: ReportFromBackend) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleConfirmStatusChange = async (
    reportId: string,
    newStatus: ReportStatus
  ) => {
    try {
      await updateReportStatus(reportId, newStatus);
      // Recargar reportes después de actualizar
      await loadReports();
    } catch (err) {
      console.error("Error updating status:", err);
      throw err;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportPDF = async (filters: ExportFilters) => {
    try {
      console.log("🔄 Iniciando exportación de PDF con filtros:", filters);

      if (Platform.OS === "web") {
        // En web, descargar el archivo
        console.log("🌐 Descargando PDF en web...");
        const pdfBlob = await exportReportsPDF(filters);
        console.log("✅ PDF recibido, tamaño:", pdfBlob.size, "bytes");

        const fileName = `reporte-cachibache-${new Date().toISOString().split("T")[0]}.pdf`;
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        Alert.alert("Éxito", "PDF descargado correctamente");
      } else {
        // En móvil, descargar y guardar el PDF
        console.log("📱 Descargando PDF en móvil...");

        // Obtener el token de autenticación
        const token = await getToken();
        if (!token) {
          Alert.alert("Error", "No se encontró el token de autenticación. Por favor inicia sesión nuevamente.");
          return;
        }

        // Construir la URL del PDF con los filtros
        const params = new URLSearchParams();
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (filters.status && filters.status.length > 0) {
          filters.status.forEach((status) => params.append("status", status));
        }

        // Construir URL completa del PDF
        const baseURL = API_BASE_URL.replace("/api", "");
        const pdfURL = `${baseURL}/api/reports/admin/export/pdf?${params.toString()}`;

        // Nombre del archivo
        const fileName = `reporte-cachibache-${new Date().toISOString().split("T")[0]}.pdf`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        console.log("📥 Descargando desde:", pdfURL);

        // Descargar el archivo
        const downloadResult = await FileSystem.downloadAsync(
          pdfURL,
          fileUri,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ PDF descargado en:", downloadResult.uri);

        // Compartir/Abrir el archivo descargado
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Guardar o compartir PDF',
            UTI: 'com.adobe.pdf',
          });
          console.log("✅ PDF compartido");
        } else {
          Alert.alert("Éxito", `PDF guardado en: ${fileName}`);
        }
      }
    } catch (error) {
      console.error("❌ Error exportando PDF:", error);
      Alert.alert(
        "Error",
        `No se pudo exportar el PDF: ${(error as Error).message}`
      );
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <YStack padding="$4" gap="$4">
        {/* Header */}
        <YStack gap="$3">
          <Text fontSize={24} fontWeight="bold">
            Gestión de Reportes
          </Text>
          <Text fontSize={14} color="$gray10">
            Total: {totalReports} reportes
          </Text>

          {/* Botón de exportar PDF */}
          <TouchableOpacity
            onPress={() => setExportModalVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: "#094b7e",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          >
            <Ionicons name="document-text" size={20} color="white" />
            <Text color="white" fontWeight="600" fontSize={15}>
              Exportar PDF
            </Text>
          </TouchableOpacity>
        </YStack>

        {/* Filtros */}
        <ReportFilters
          onStatusChange={handleStatusChange}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
        />

        {/* Error Message */}
        {error && (
          <YStack
            padding="$4"
            backgroundColor="#fee2e2"
            borderRadius="$4"
            borderWidth={1}
            borderColor="#ef4444"
          >
            <Text color="#991b1b">{error}</Text>
          </YStack>
        )}

        {/* Tabla o Loading */}
        {isLoading && !error ? (
          <YStack padding="$4" alignItems="center">
            <Spinner size="large" color="$blue10" />
          </YStack>
        ) : (
          <ReportTable
            reports={reports}
            isLoading={false}
            onEditStatus={handleEditStatus}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Modal para cambiar estado */}
        {selectedReport && (
          <ChangeStatusModal
            isVisible={modalVisible}
            currentStatus={selectedReport.status}
            reportId={selectedReport.id}
            reportAddress={selectedReport.address}
            onClose={() => {
              setModalVisible(false);
              setSelectedReport(null);
            }}
            onConfirm={handleConfirmStatusChange}
          />
        )}

        {/* Modal para exportar PDF */}
        <ExportPDFModal
          visible={exportModalVisible}
          onClose={() => setExportModalVisible(false)}
          onExport={handleExportPDF}
        />
      </YStack>
    </ScrollView>
  );
}
