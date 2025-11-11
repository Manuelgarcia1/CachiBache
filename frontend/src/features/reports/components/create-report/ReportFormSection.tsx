import { Input, Text, YStack, TextArea } from 'tamagui';
import { ImagePickerButton } from './ImagePickerButton';
import { SeveritySelector } from './SeveritySelector';
import { IntelligentVoiceAssistant } from './IntelligentVoiceAssistant';

interface ReportFormSectionProps {
  address: string;
  severity: string;
  description?: string;
  imageUri?: string;
  onAddressChange: (address: string) => void;
  onSeverityChange: (severity: string) => void;
  onDescriptionChange: (description: string) => void;
  onImageSelected: (uri: string) => void;
}

export function ReportFormSection({
  address,
  severity,
  description = '',
  imageUri,
  onAddressChange,
  onSeverityChange,
  onDescriptionChange,
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
          placeholder="Ej: Av. Corrientes 1234"
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
          Descripción (opcional)
        </Text>
        <TextArea
          placeholder="Escribe o dicta los detalles del bache..."
          value={description}
          onChangeText={onDescriptionChange}
          backgroundColor="#f8fafc"
          borderColor="#e2e8f0"
          borderRadius={8}
          padding="$3"
          minHeight={100}
          numberOfLines={4}
        />
        <IntelligentVoiceAssistant
          onTranscriptComplete={onDescriptionChange}
          initialValue={description}
        />
      </YStack>

      <YStack gap="$2">
        <Text fontSize={14} fontWeight="500" color="#64748b">
          Severidad *
        </Text>
        <SeveritySelector
          value={severity}
          onValueChange={onSeverityChange}
        />
      </YStack>

      <ImagePickerButton imageUri={imageUri} onImageSelected={onImageSelected} />
    </YStack>
  );
}