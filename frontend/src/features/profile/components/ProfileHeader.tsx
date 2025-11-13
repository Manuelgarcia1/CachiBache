import { useState } from 'react';
import { Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Avatar, Text, YStack, Spinner } from 'tamagui';
import { useImagePicker } from '@/src/shared/hooks/useImagePicker';
import { cloudinaryService } from '@/src/shared/services/cloudinary.service';
import { usersService } from '@/src/shared/services/users.service';
import { useAuth } from '@/src/shared/contexts/AuthContext';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
}

export function ProfileHeader({ name, email, avatar }: ProfileHeaderProps) {
  const { showImagePickerOptions } = useImagePicker();
  const { refreshUser } = useAuth(); // Asumimos que AuthContext tiene una función para recargar datos
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (localUri: string) => {
    setIsUploading(true);
    try {
      // 1. Subir la imagen a Cloudinary
      const { secure_url } = await cloudinaryService.uploadImage(localUri, 'avatars');

      // 2. Notificar al backend sobre la nueva URL
      await usersService.updateUserAvatar(secure_url);

      // 3. Recargar los datos del usuario para mostrar la nueva imagen
      await refreshUser();

      Alert.alert('Éxito', 'Tu foto de perfil ha sido actualizada.');
    } catch (error) {
      console.error("Error al cambiar el avatar:", error);
      Alert.alert('Error', 'No se pudo actualizar tu foto de perfil.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <YStack alignItems="center" backgroundColor="#094b7e" paddingTop={60} paddingBottom="$6">
      <YStack>
        <Avatar circular size="$12">
          {/* Solo mostrar imagen si avatar tiene valor */}
          {avatar && <Avatar.Image key={avatar} src={avatar} />}
          <Avatar.Fallback
            backgroundColor="#64748b"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              color="#fff"
              fontSize={48}
              fontWeight="bold"
              textAlign="center"
            >
              {name[0]?.toUpperCase() || 'U'}
            </Text>
          </Avatar.Fallback>
        </Avatar>
        {/* --- 👇 LÁPIZ DE EDICIÓN Y SPINNER DE CARGA 👇 --- */}
        <YStack
          position="absolute"
          bottom={0}
          right={0}
          backgroundColor="$yellow8"
          padding="$2"
          borderRadius="$10"
          pressStyle={{ scale: 0.9 }}
          onPress={() => !isUploading && showImagePickerOptions(handleAvatarChange)}
          disabled={isUploading}
        >
          {isUploading ? (
            <Spinner color="$black" />
          ) : (
            <Feather name="edit-2" size={20} color="#111827" />
          )}
        </YStack>
      </YStack>

      <Text fontSize={28} fontWeight="700" color="#fff" marginTop="$4">
        {name}
      </Text>
      <Text fontSize={24} color="#cbd5e1" marginTop="$2">
        {email}
      </Text>
    </YStack>
  );
}