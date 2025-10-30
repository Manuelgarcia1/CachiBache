// Badge colorizado según el estado del reporte
import { Text, XStack } from 'tamagui';
import { ReportStatus } from '@/src/shared/types/report.types';

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

const STATUS_CONFIG = {
  PENDIENTE: {
    bg: '#fef3c7',
    color: '#92400e',
    label: 'Pendiente',
  },
  EN_REPARACION: {
    bg: '#dbeafe',
    color: '#1e40af',
    label: 'En Reparación',
  },
  RESUELTO: {
    bg: '#d1fae5',
    color: '#065f46',
    label: 'Resuelto',
  },
  DESCARTADO: {
    bg: '#fee2e2',
    color: '#991b1b',
    label: 'Descartado',
  },
};

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDIENTE;

  return (
    <XStack
      backgroundColor={config.bg}
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$2"
    >
      <Text
        fontSize={12}
        fontWeight="600"
        color={config.color}
      >
        {config.label}
      </Text>
    </XStack>
  );
}
