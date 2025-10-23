// Componente de filtros para reportes
import { YStack, XStack, Input, Select, Button } from 'tamagui';
import { ReportStatus } from '@/src/shared/types/report.types';
import { Feather } from '@expo/vector-icons';

interface ReportFiltersProps {
  onStatusChange: (status: ReportStatus | undefined) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

export function ReportFilters({
  onStatusChange,
  onSearchChange,
  onClearFilters,
}: ReportFiltersProps) {
  return (
    <YStack gap="$3" padding="$4" backgroundColor="#fff" borderRadius="$4">
      {/* Búsqueda */}
      <Input
        placeholder="Buscar por dirección..."
        onChangeText={onSearchChange}
        size="$4"
      />

      {/* Filtros en fila */}
      <XStack gap="$3" flexWrap="wrap">
        {/* Estado */}
        <Select onValueChange={(value) => onStatusChange(value as ReportStatus)}>
          <Select.Trigger width={200}>
            <Select.Value placeholder="Todos los estados" />
          </Select.Trigger>

          <Select.Content>
            <Select.Item index={0} value="all">
              <Select.ItemText>Todos los estados</Select.ItemText>
            </Select.Item>
            <Select.Item index={1} value="PENDIENTE">
              <Select.ItemText>Pendiente</Select.ItemText>
            </Select.Item>
            <Select.Item index={2} value="EN_REPARACION">
              <Select.ItemText>En Reparación</Select.ItemText>
            </Select.Item>
            <Select.Item index={3} value="RESUELTO">
              <Select.ItemText>Resuelto</Select.ItemText>
            </Select.Item>
            <Select.Item index={4} value="DESCARTADO">
              <Select.ItemText>Descartado</Select.ItemText>
            </Select.Item>
          </Select.Content>
        </Select>

        {/* Botón limpiar */}
        <Button
          icon={<Feather name="x" size={16} />}
          onPress={onClearFilters}
          chromeless
        >
          Limpiar
        </Button>
      </XStack>
    </YStack>
  );
}
