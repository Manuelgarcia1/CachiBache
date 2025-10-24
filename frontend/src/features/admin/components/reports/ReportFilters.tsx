// Componente de filtros para reportes
import { useState } from 'react';
import { YStack, XStack, Input, Button, Text } from 'tamagui';
import { ReportStatus } from '@/src/shared/types/report.types';
import { Feather } from '@expo/vector-icons';

interface ReportFiltersProps {
  onStatusChange: (status: ReportStatus | undefined) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS = [
  { value: undefined, label: 'Todos', color: '#64748b' },
  { value: 'PENDIENTE' as ReportStatus, label: 'Pendiente', color: '#eab308' },
  { value: 'EN_REPARACION' as ReportStatus, label: 'En Reparación', color: '#3b82f6' },
  { value: 'RESUELTO' as ReportStatus, label: 'Resuelto', color: '#22c55e' },
  { value: 'DESCARTADO' as ReportStatus, label: 'Descartado', color: '#ef4444' },
];

export function ReportFilters({
  onStatusChange,
  onSearchChange,
  onClearFilters,
}: ReportFiltersProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | undefined>(undefined);
  const [searchValue, setSearchValue] = useState('');

  const handleStatusClick = (status: ReportStatus | undefined) => {
    setSelectedStatus(status);
    onStatusChange(status);
  };

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
    onSearchChange(text);
  };

  const handleClear = () => {
    setSelectedStatus(undefined);
    setSearchValue('');
    onClearFilters();
  };

  const hasActiveFilters = selectedStatus !== undefined || searchValue !== '';

  return (
    <YStack
      gap="$4"
      padding="$4"
      backgroundColor="#fff"
      borderRadius="$3"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={3}
      elevation={2}
    >
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={16} fontWeight="600" color="$gray12">
          Filtros
        </Text>
        {hasActiveFilters && (
          <Button
            size="$2"
            chromeless
            icon={<Feather name="x" size={14} />}
            onPress={handleClear}
            color="$gray11"
          >
            Limpiar filtros
          </Button>
        )}
      </XStack>

      {/* Búsqueda */}
      <XStack gap="$2" alignItems="center" position="relative">
        <YStack flex={1} position="relative">
          <XStack
            position="absolute"
            left={12}
            top={0}
            bottom={0}
            alignItems="center"
            zIndex={1}
            pointerEvents="none"
          >
            <Feather name="search" size={18} color="#94a3b8" />
          </XStack>
          <Input
            placeholder="Buscar por dirección..."
            value={searchValue}
            onChangeText={handleSearchChange}
            size="$4"
            paddingLeft={40}
            borderColor={searchValue ? '$blue8' : '$borderColor'}
            focusStyle={{
              borderColor: '$blue9',
            }}
          />
        </YStack>
      </XStack>

      {/* Filtros por estado con chips */}
      <YStack gap="$2">
        <Text fontSize={13} fontWeight="500" color="$gray11">
          Estado del reporte
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = selectedStatus === option.value;
            return (
              <Button
                key={option.label}
                size="$3"
                onPress={() => handleStatusClick(option.value)}
                backgroundColor={isSelected ? option.color : '#f1f5f9'}
                borderWidth={1}
                borderColor={isSelected ? option.color : '#e2e8f0'}
                pressStyle={{
                  backgroundColor: isSelected ? option.color : '#e2e8f0',
                  opacity: 0.8,
                }}
                hoverStyle={{
                  backgroundColor: isSelected ? option.color : '#e2e8f0',
                  opacity: 0.9,
                }}
              >
                <Text
                  fontSize={13}
                  fontWeight={isSelected ? '600' : '500'}
                  color={isSelected ? '#fff' : '#475569'}
                >
                  {option.label}
                </Text>
              </Button>
            );
          })}
        </XStack>
      </YStack>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <XStack gap="$2" alignItems="center" paddingTop="$2" borderTopWidth={1} borderTopColor="$borderColor">
          <Feather name="filter" size={14} color="#64748b" />
          <Text fontSize={12} color="$gray11">
            {selectedStatus && `Estado: ${STATUS_OPTIONS.find(o => o.value === selectedStatus)?.label}`}
            {selectedStatus && searchValue && ' • '}
            {searchValue && `Búsqueda: "${searchValue}"`}
          </Text>
        </XStack>
      )}
    </YStack>
  );
}
