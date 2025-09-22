import { Input, Text, YStack } from 'tamagui';
import { ImagePickerButton } from './ImagePickerButton';

interface ReportFormSectionProps {
  title: string;
  description: string;
  imageUri?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onImageSelected: (uri: string) => void;
}

export function ReportFormSection({
  title,
  description,
  imageUri,
  onTitleChange,
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
          Título *
        </Text>
        <Input
          placeholder="Ej: Bache en Av. Corrientes 1234"
          value={title}
          onChangeText={onTitleChange}
          backgroundColor="#f8fafc"
          borderColor="#e2e8f0"
          borderRadius={8}
          padding="$3"
        />
      </YStack>

      <YStack gap="$2">
        <Text fontSize={14} fontWeight="500" color="#64748b">
          Descripción *
        </Text>
        <Input
          placeholder="Describe el estado del bache, tamaño, profundidad, etc."
          value={description}
          onChangeText={onDescriptionChange}
          backgroundColor="#f8fafc"
          borderColor="#e2e8f0"
          borderRadius={8}
          padding="$3"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          height={100}
        />
      </YStack>

      <ImagePickerButton imageUri={imageUri} onImageSelected={onImageSelected} />
    </YStack>
  );
}