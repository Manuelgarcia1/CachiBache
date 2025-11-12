import { useState, useCallback } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { YStack, XStack, Text, Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { getDashboardMetrics } from "@/src/shared/services/admin.service";
import { MetricCard } from "./MetricCard";
import { StatusChart } from "./StatusChart";
import { SeverityChart } from "./SeverityChart";
import { useFocusEffect } from "expo-router";
import { useAdminLocation } from "../../hooks/useAdminLocation";

export function DashboardScreen() {
  const { user } = useAuth();
  const { city, isLoadingCity, cityError, retryDetectCity } = useAdminLocation();

  const [metrics, setMetrics] = useState<{
    totalReports: number;
    reportsBySeverity: Record<string, number>;
    reportsByStatus: Record<string, number>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardMetrics({
        city: city || undefined, // 🎯 Filtrar por ciudad detectada
      });
      setMetrics(data);
    } catch (err) {
      console.error("Error loading metrics:", err);
      setError("Error al cargar las métricas");
    } finally {
      setIsLoading(false);
    }
  }, [city]); // 🔄 Recargar cuando cambie la ciudad

  // Recargar métricas cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadMetrics();
    }, [loadMetrics])
  );

  // Calcular métricas derivadas
  const pendingReports = metrics?.reportsByStatus?.PENDIENTE || 0;
  const inProgressReports = metrics?.reportsByStatus?.EN_REPARACION || 0;
  const resolvedReports = metrics?.reportsByStatus?.RESUELTO || 0;
  const discardedReports = metrics?.reportsByStatus?.DESCARTADO || 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <YStack flex={1} padding="$4" gap="$4">
        {/* Header */}
        <YStack gap="$3">
          <Text fontSize={24} fontWeight="bold">
            Resumen General
          </Text>
          <Text fontSize={14} color="$gray10">
            Bienvenido, {user?.name}
          </Text>

          {/* Indicador de ciudad detectada */}
          {isLoadingCity ? (
            <XStack gap="$2" alignItems="center">
              <Spinner size="small" color="$blue10" />
              <Text fontSize={13} color="$gray10">
                Detectando ubicación...
              </Text>
            </XStack>
          ) : cityError ? (
            <XStack
              padding="$2"
              paddingHorizontal="$3"
              backgroundColor="#fef3c7"
              borderRadius="$3"
              alignItems="center"
              gap="$2"
              alignSelf="flex-start"
            >
              <Ionicons name="warning" size={16} color="#f59e0b" />
              <Text fontSize={12} color="#92400e">
                {cityError}
              </Text>
              <TouchableOpacity onPress={retryDetectCity}>
                <Text fontSize={12} color="#094b7e" fontWeight="600">
                  Reintentar
                </Text>
              </TouchableOpacity>
            </XStack>
          ) : city ? (
            <XStack
              padding="$2"
              paddingHorizontal="$3"
              backgroundColor="#dbeafe"
              borderRadius="$3"
              alignItems="center"
              gap="$2"
              alignSelf="flex-start"
            >
              <Ionicons name="location" size={16} color="#1e40af" />
              <Text fontSize={12} color="#1e3a8a" fontWeight="600">
                Estadísticas de: {city}
              </Text>
            </XStack>
          ) : null}
        </YStack>

        {/* Loading State */}
        {isLoading && (
          <YStack padding="$4" alignItems="center">
            <Spinner size="large" color="$blue10" />
            <Text marginTop="$3" color="$gray10">
              Cargando métricas...
            </Text>
          </YStack>
        )}

        {/* Error State */}
        {error && !isLoading && (
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

        {/* Dashboard Content */}
        {!isLoading && !error && metrics && (
          <YStack gap="$4">
            {/* Métricas principales */}
            <XStack gap="$4" flexWrap="wrap">
              <MetricCard
                title="Total Reportes"
                value={metrics.totalReports}
                icon="file-text"
                iconColor="#3b82f6"
                backgroundColor="#dbeafe"
                description="Todos los reportes en el sistema"
              />
              <MetricCard
                title="Pendientes"
                value={pendingReports}
                icon="clock"
                iconColor="#f59e0b"
                backgroundColor="#fef3c7"
                description="Esperando atención"
              />
              <MetricCard
                title="En Reparación"
                value={inProgressReports}
                icon="tool"
                iconColor="#3b82f6"
                backgroundColor="#dbeafe"
                description="Siendo trabajados"
              />
              <MetricCard
                title="Resueltos"
                value={resolvedReports}
                icon="check-circle"
                iconColor="#10b981"
                backgroundColor="#d1fae5"
                description="Completados exitosamente"
              />
              <MetricCard
                title="Descartados"
                value={discardedReports}
                icon="x-circle"
                iconColor="#ef4444"
                backgroundColor="#fee2e2"
                description="Reportes descartados"
              />
            </XStack>

            {/* Gráficos */}
            <XStack gap="$4" flexWrap="wrap" alignItems="flex-start">
              {/* Gráfico de Estado */}
              <YStack flex={1} minWidth={300}>
                <StatusChart data={metrics.reportsByStatus} />
              </YStack>

              {/* Gráfico de Severidad */}
              <YStack flex={1} minWidth={300}>
                <SeverityChart data={metrics.reportsBySeverity} />
              </YStack>
            </XStack>

            {/* Estadísticas adicionales */}
            <YStack
              backgroundColor="#fff"
              borderRadius="$4"
              padding="$4"
              gap="$3"
              borderWidth={1}
              borderColor="$gray5"
            >
              <Text fontSize={18} fontWeight="bold">
                Resumen General
              </Text>
              <YStack gap="$2">
                <XStack justifyContent="space-between">
                  <Text fontSize={14} color="$gray10">
                    Reportes activos (Pendiente + En Reparación):
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {pendingReports + inProgressReports}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize={14} color="$gray10">
                    Reportes cerrados (Resuelto + Descartado):
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {resolvedReports + discardedReports}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize={14} color="$gray10">
                    Tasa de resolución:
                  </Text>
                  <Text fontSize={14} fontWeight="600" color="#10b981">
                    {metrics.totalReports > 0
                      ? (
                          (resolvedReports / metrics.totalReports) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
