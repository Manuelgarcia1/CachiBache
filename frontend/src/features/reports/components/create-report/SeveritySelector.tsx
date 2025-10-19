import { useState } from 'react';
import { Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, YStack, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

interface SeveritySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const severityOptions = [
  { label: 'Leve', value: 'LEVE', color: '#10b981', description: 'Daño menor en la superficie' },
  { label: 'Intermedio', value: 'INTERMEDIO', color: '#f59e0b', description: 'Daño moderado que requiere atención' },
  { label: 'Grave', value: 'GRAVE', color: '#ef4444', description: 'Daño severo que representa peligro' },
];

export function SeveritySelector({ value, onValueChange }: SeveritySelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedOption = severityOptions.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : 'Selecciona severidad';
  const displayColor = selectedOption ? selectedOption.color : '#64748b';

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={styles.selector}
      >
        <XStack alignItems="center" justifyContent="space-between" flex={1}>
          <XStack alignItems="center" gap="$2">
            {selectedOption && (
              <YStack
                width={12}
                height={12}
                borderRadius={6}
                backgroundColor={displayColor}
              />
            )}
            <Text
              fontSize={16}
              color={selectedOption ? '#1e293b' : '#94a3b8'}
            >
              {displayText}
            </Text>
          </XStack>
          <Ionicons name="chevron-down" size={20} color="#64748b" />
        </XStack>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <YStack
            backgroundColor="#fff"
            borderRadius={16}
            padding="$4"
            gap="$3"
            width="85%"
            maxWidth={400}
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <Text fontSize={18} fontWeight="600" color="#1e293b">
                Selecciona la severidad
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </XStack>

            {severityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelect(option.value)}
                style={styles.optionButton}
              >
                <XStack
                  alignItems="center"
                  gap="$3"
                  padding="$3"
                  borderRadius={12}
                  backgroundColor={value === option.value ? '#f1f5f9' : 'transparent'}
                  borderWidth={value === option.value ? 2 : 1}
                  borderColor={value === option.value ? option.color : '#e2e8f0'}
                >
                  <YStack
                    width={24}
                    height={24}
                    borderRadius={12}
                    backgroundColor={option.color}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {value === option.value && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </YStack>
                  <YStack flex={1}>
                    <Text fontSize={16} fontWeight="600" color="#1e293b">
                      {option.label}
                    </Text>
                    <Text fontSize={13} color="#64748b">
                      {option.description}
                    </Text>
                  </YStack>
                </XStack>
              </TouchableOpacity>
            ))}
          </YStack>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    height: 48,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: {
    width: '100%',
  },
});
