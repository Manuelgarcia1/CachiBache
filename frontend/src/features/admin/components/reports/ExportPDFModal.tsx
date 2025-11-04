import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ExportFilters {
  startDate?: string;
  endDate?: string;
  status?: string[];
}

interface ExportPDFModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: (filters: ExportFilters) => Promise<void>;
}

const PRESET_PERIODS = [
  { label: 'Última semana', days: 7 },
  { label: 'Último mes', days: 30 },
  { label: 'Últimos 3 meses', days: 90 },
  { label: 'Último año', days: 365 },
  { label: 'Todo el tiempo', days: null },
];

const STATUS_OPTIONS = [
  { value: 'PENDIENTE', label: 'Pendiente', color: '#f59e0b' },
  { value: 'EN_REPARACION', label: 'En Reparación', color: '#3b82f6' },
  { value: 'RESUELTO', label: 'Resuelto', color: '#10b981' },
  { value: 'DESCARTADO', label: 'Descartado', color: '#ef4444' },
];

export const ExportPDFModal: React.FC<ExportPDFModalProps> = ({
  visible,
  onClose,
  onExport,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(1); // Último mes por defecto
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const filters: ExportFilters = {};

      // Calcular fechas según el período seleccionado
      const period = PRESET_PERIODS[selectedPeriod];
      if (period.days !== null) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - period.days);

        filters.startDate = startDate.toISOString().split('T')[0];
        filters.endDate = endDate.toISOString().split('T')[0];
      }

      // Agregar filtros de estado si hay seleccionados
      if (selectedStatuses.length > 0) {
        filters.status = selectedStatuses;
      }

      await onExport(filters);
      onClose();
    } catch (error) {
      console.error('Error exportando PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const resetFilters = () => {
    setSelectedPeriod(1);
    setSelectedStatuses([]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="document-text" size={24} color="#094b7e" />
              <Text style={styles.headerTitle}>Exportar PDF</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Período */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📅 Período de tiempo</Text>
              <Text style={styles.sectionSubtitle}>
                Selecciona el rango de fechas para incluir en el reporte
              </Text>
              <View style={styles.periodContainer}>
                {PRESET_PERIODS.map((period, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.periodButton,
                      selectedPeriod === index && styles.periodButtonActive,
                    ]}
                    onPress={() => setSelectedPeriod(index)}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        selectedPeriod === index && styles.periodButtonTextActive,
                      ]}
                    >
                      {period.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Estados */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔍 Filtrar por estado</Text>
              <Text style={styles.sectionSubtitle}>
                Opcional: Selecciona los estados a incluir (si no seleccionas ninguno, se incluyen todos)
              </Text>
              <View style={styles.statusContainer}>
                {STATUS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusButton,
                      selectedStatuses.includes(option.value) && {
                        backgroundColor: option.color,
                        borderColor: option.color,
                      },
                    ]}
                    onPress={() => toggleStatus(option.value)}
                  >
                    <View style={styles.statusButtonContent}>
                      {selectedStatuses.includes(option.value) && (
                        <Ionicons name="checkmark-circle" size={18} color="white" />
                      )}
                      <Text
                        style={[
                          styles.statusButtonText,
                          selectedStatuses.includes(option.value) && styles.statusButtonTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Contenido del PDF */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Contenido del PDF</Text>
              <View style={styles.infoBox}>
                <View style={styles.infoItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.infoText}>Estadísticas generales</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.infoText}>Tablas de distribución</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.infoText}>Barras de progreso visuales</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.infoText}>Tasa de resolución</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.infoText}>Reportes por severidad y estado</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer con botones */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
              disabled={isExporting}
            >
              <Ionicons name="refresh" size={18} color="#666" />
              <Text style={styles.resetButtonText}>Resetear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
              onPress={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="download" size={18} color="white" />
                  <Text style={styles.exportButtonText}>Generar PDF</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  periodContainer: {
    gap: 8,
  },
  periodButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  periodButtonActive: {
    borderColor: '#094b7e',
    backgroundColor: '#f0f7ff',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  periodButtonTextActive: {
    color: '#094b7e',
    fontWeight: '600',
  },
  statusContainer: {
    gap: 8,
  },
  statusButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  statusButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  statusButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  exportButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#094b7e',
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
