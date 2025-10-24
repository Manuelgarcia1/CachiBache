// Tabla de reportes para admin
import { ScrollView, YStack, XStack, Text, Button } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { ReportFromBackend } from '@/src/shared/types/report.types';
import { ReportStatusBadge } from './ReportStatusBadge';

interface ReportTableProps {
  reports: ReportFromBackend[];
  isLoading: boolean;
  onEditStatus: (report: ReportFromBackend) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ReportTable({
  reports,
  isLoading,
  onEditStatus,
  currentPage,
  totalPages,
  onPageChange,
}: ReportTableProps) {
  if (isLoading) {
    return (
      <YStack padding="$4" alignItems="center">
        <Text fontSize={16} color="$gray10">
          Cargando reportes...
        </Text>
      </YStack>
    );
  }

  if (reports.length === 0) {
    return (
      <YStack padding="$4" alignItems="center">
        <Feather name="inbox" size={48} color="#94a3b8" />
        <Text fontSize={16} color="$gray10" marginTop="$3">
          No se encontraron reportes
        </Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$3">
      {/* Tabla */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <YStack gap="$2" minWidth={800}>
          {/* Header */}
          <XStack
            backgroundColor="#f1f5f9"
            padding="$3"
            borderRadius="$2"
            gap="$2"
          >
            <XStack width={90} alignItems="center">
              <Text fontSize={12} fontWeight="bold" color="$gray11">
                ID
              </Text>
            </XStack>
            <XStack width={200} alignItems="center">
              <Text fontSize={12} fontWeight="bold" color="$gray11">
                Dirección
              </Text>
            </XStack>
            <XStack width={130} alignItems="center">
              <Text fontSize={12} fontWeight="bold" color="$gray11">
                Estado
              </Text>
            </XStack>
            <XStack width={100} alignItems="center">
              <Text fontSize={12} fontWeight="bold" color="$gray11">
                Severidad
              </Text>
            </XStack>
            <XStack width={100} alignItems="center">
              <Text fontSize={12} fontWeight="bold" color="$gray11">
                Fecha
              </Text>
            </XStack>
            <XStack width={80} alignItems="center" justifyContent="center">
              <Text fontSize={12} fontWeight="bold" color="$gray11">
                Acciones
              </Text>
            </XStack>
          </XStack>

          {/* Filas */}
          {reports.map((report) => (
            <XStack
              key={report.id}
              backgroundColor="#fff"
              padding="$3"
              borderRadius="$2"
              borderWidth={1}
              borderColor="$gray5"
              gap="$2"
            >
              <XStack width={90} alignItems="center">
                <Text fontSize={12} color="$gray11">
                  {report.id.substring(0, 8)}...
                </Text>
              </XStack>
              <XStack width={200} alignItems="center">
                <Text fontSize={14}>
                  {report.address}
                </Text>
              </XStack>
              <XStack width={130} alignItems="center">
                <ReportStatusBadge status={report.status} />
              </XStack>
              <XStack width={100} alignItems="center">
                <Text fontSize={14} textTransform="capitalize">
                  {report.severity.toLowerCase()}
                </Text>
              </XStack>
              <XStack width={100} alignItems="center">
                <Text fontSize={12} color="$gray10">
                  {new Date(report.createdAt).toLocaleDateString('es-AR')}
                </Text>
              </XStack>
              <XStack width={80} alignItems="center" justifyContent="center">
                <Button
                  size="$3"
                  icon={<Feather name="edit-2" size={14} />}
                  onPress={() => onEditStatus(report)}
                  chromeless
                />
              </XStack>
            </XStack>
          ))}
        </YStack>
      </ScrollView>

      {/* Paginación */}
      {totalPages > 1 && (
        <XStack justifyContent="center" gap="$2" marginTop="$3">
          <Button
            size="$3"
            disabled={currentPage === 1}
            onPress={() => onPageChange(currentPage - 1)}
            icon={<Feather name="chevron-left" size={16} />}
          />
          <XStack gap="$2" alignItems="center">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  size="$3"
                  onPress={() => onPageChange(page)}
                  backgroundColor={
                    currentPage === page ? '#094b7e' : 'transparent'
                  }
                  color={currentPage === page ? '#fff' : '$gray11'}
                >
                  {page}
                </Button>
              );
            })}
          </XStack>
          <Button
            size="$3"
            disabled={currentPage === totalPages}
            onPress={() => onPageChange(currentPage + 1)}
            icon={<Feather name="chevron-right" size={16} />}
          />
        </XStack>
      )}
    </YStack>
  );
}
