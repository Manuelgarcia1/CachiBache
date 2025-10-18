import { Input, Text, YStack } from 'tamagui';
import { ImagePickerButton } from './ImagePickerButton';
import { Picker } from '@react-native-picker/picker';

interface ReportFormSectionProps {
  address: string;
  severity: string;
  imageUri?: string;
  onAddressChange: (address: string) => void;
  onSeverityChange: (severity: string) => void;
  onImageSelected: (uri: string) => void;
}

export function ReportFormSection({
  address,
  severity,
  imageUri,
  onAddressChange,
  onSeverityChange,
  onImageSelected,
}: ReportFormSectionProps) {
  return (
    <YStack backgroundColor="#fff" padding="$4" borderRadius={12} gap="$3">
      <Text fontSize={18} fontWeight="600" color="#1e293b">
        Información del bache
      </Text>

      <YStack gap="$2">
        <Text fontSize={14} fontWeight="500" color="#64748b">
          Dirección *
        </Text>
        <Input
          placeholder="Ej: Bache en Av. Corrientes 1234"
          value={address}
          onChangeText={onAddressChange}
          backgroundColor="#f8fafc"
          borderColor="#e2e8f0"
          borderRadius={8}
          padding="$3"
        />
      </YStack>

      <YStack gap="$2">
      <Text fontSize={14} fontWeight="500" color="#64748b">
        Severidad *
      </Text>
      <Picker
        selectedValue={severity}
        onValueChange={onSeverityChange}
        style={{
          backgroundColor: "#f8fafc",
          borderColor: "#e2e8f0",
          borderRadius: 8,
          padding: 12,
          height: 48,
        }}
      >
        <Picker.Item label="Selecciona severidad" value="" />
        <Picker.Item label="Leve" value="LEVE" />
        <Picker.Item label="Intermedio" value="INTERMEDIO" />
        <Picker.Item label="Grave" value="GRAVE" />
      </Picker>
    </YStack>

      <ImagePickerButton imageUri={imageUri} onImageSelected={onImageSelected} />
    </YStack>
  );
}