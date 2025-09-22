import { Feather } from '@expo/vector-icons';
import { Button, Text, YStack, Image } from 'tamagui';
import { useImagePicker } from '../../hooks/useImagePicker';

interface ImagePickerButtonProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
}

export function ImagePickerButton({ imageUri, onImageSelected }: ImagePickerButtonProps) {
  const { showImagePickerOptions } = useImagePicker();

  return (
    <YStack gap="$2">
      <Text fontSize={14} fontWeight="500" color="#64748b">
        Foto (opcional)
      </Text>
      <Button
        onPress={() => showImagePickerOptions(onImageSelected)}
        backgroundColor="#f1f5f9"
        borderColor="#e2e8f0"
        borderWidth={1}
        borderRadius={8}
        icon={<Feather name="camera" size={20} color="#64748b" />}
        color="#64748b"
      >
        {imageUri ? 'Cambiar foto' : 'Agregar foto'}
      </Button>

      {imageUri && (
        <YStack gap="$2">
          <Text fontSize={12} color="#22c55e">
            ✓ Foto seleccionada
          </Text>
          <YStack
            borderRadius={8}
            overflow="hidden"
            borderWidth={1}
            borderColor="#e2e8f0"
          >
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: 120 }}
              resizeMode="cover"
            />
          </YStack>
        </YStack>
      )}
    </YStack>
  );
}