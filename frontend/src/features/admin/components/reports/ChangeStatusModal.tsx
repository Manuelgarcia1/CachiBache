// Modal para cambiar el estado de un reporte
import { useState } from 'react';
import { Modal } from 'react-native';
import { YStack, XStack, Text, Button, Select } from 'tamagui';
import { ReportStatus } from '@/src/shared/types/report.types';

interface ChangeStatusModalProps {
  isVisible: boolean;
  currentStatus: ReportStatus;
  reportId: string;
  reportAddress: string;
  onClose: () => void;
  onConfirm: (reportId: string, newStatus: ReportStatus) => Promise<void>;
}

export function ChangeStatusModal({
  isVisible,
  currentStatus,
  reportId,
  reportAddress,
  onClose,
  onConfirm,
}: ChangeStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reportId, selectedStatus);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <YStack
        flex={1}
        backgroundColor="rgba(0,0,0,0.5)"
        justifyContent="center"
        alignItems="center"
        padding="$4"
      >
        <YStack
          backgroundColor="#fff"
          borderRadius="$4"
          padding="$4"
          width="90%"
          maxWidth={400}
          gap="$4"
        >
          {/* Header */}
          <Text fontSize={20} fontWeight="bold">
            Cambiar Estado
          </Text>

          {/* Dirección */}
          <Text fontSize={14} color="$gray10">
            {reportAddress}
          </Text>

          {/* Selector de estado */}
          <YStack gap="$2">
            <Text fontSize={14} fontWeight="600">
              Nuevo estado:
            </Text>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as ReportStatus)}
            >
              <Select.Trigger width="100%" backgroundColor="$gray2" borderColor="$gray6">
                <Select.Value placeholder="Selecciona un estado" />
              </Select.Trigger>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton />
                <Select.Viewport>
                  <Select.Item index={0} value="PENDIENTE">
                    <Select.ItemText>Pendiente</Select.ItemText>
                  </Select.Item>
                  <Select.Item index={1} value="EN_REPARACION">
                    <Select.ItemText>En Reparación</Select.ItemText>
                  </Select.Item>
                  <Select.Item index={2} value="RESUELTO">
                    <Select.ItemText>Resuelto</Select.ItemText>
                  </Select.Item>
                  <Select.Item index={3} value="DESCARTADO">
                    <Select.ItemText>Descartado</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>
          </YStack>

          {/* Botones */}
          <XStack gap="$3" justifyContent="flex-end">
            <Button onPress={onClose} chromeless disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              onPress={handleConfirm}
              backgroundColor="#22c55e"
              color="#fff"
              disabled={isSubmitting}
              opacity={isSubmitting ? 0.7 : 1}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </XStack>
        </YStack>
      </YStack>
    </Modal>
  );
}
