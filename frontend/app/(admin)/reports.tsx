import { useState, useEffect } from "react";
import { YStack, Text, Spinner } from "tamagui";
import { ReportTable } from "@/src/features/admin/components/ReportTable";
import { ReportFilters } from "@/src/features/admin/components/ReportFilters";
import { ChangeStatusModal } from "@/src/features/admin/components/ChangeStatusModal";
import {
  getAllReportsAdmin,
  updateReportStatus,
} from "@/src/shared/services/admin.service";
import {
  ReportFromBackend,
  ReportStatus,
} from "@/src/shared/types/report.types";

export default function ReportsAdmin() {
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

  // Función para cargar reportes
  const loadReports = async () => {
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
  };

  // Cargar reportes cuando cambien los filtros o la página
  useEffect(() => {
    loadReports();
  }, [currentPage, statusFilter, searchQuery]);

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

  return (
    <YStack flex={1} padding="$4" backgroundColor="#f8fafc" gap="$4">
      {/* Header */}
      <YStack gap="$2">
        <Text fontSize={32} fontWeight="bold">
          Gestión de Reportes
        </Text>
        <Text fontSize={16} color="$gray10">
          Total: {totalReports} reportes
        </Text>
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
    </YStack>
  );
}
