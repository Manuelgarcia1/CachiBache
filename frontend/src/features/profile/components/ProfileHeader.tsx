import { useState } from "react";
import { Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Avatar, Text, YStack, Spinner } from "tamagui";
import { useImagePicker } from "@/src/shared/hooks/useImagePicker";
import { cloudinaryService } from "@/src/shared/services/cloudinary.service";
import { usersService } from "@/src/shared/services/users.service";
import { useAuth } from "@/src/shared/contexts/AuthContext";

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
}

export function ProfileHeader({ name, email, avatar }: ProfileHeaderProps) {
  const { showImagePickerOptions } = useImagePicker({
    aspectRatio: [1, 1],
    title: "Seleccionar Foto de Perfil",
    message: "Elige una opción",
  });
  const { refreshUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (localUri: string) => {
    setIsUploading(true);
    try {
      const { secure_url } = await cloudinaryService.uploadImage(
        localUri,
        "avatars"
      );
      await usersService.updateUserAvatar(secure_url);
      await refreshUser();
      Alert.alert("Éxito", "Tu foto de perfil ha sido actualizada.");
    } catch {
      Alert.alert("Error", "No se pudo actualizar tu foto de perfil.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <YStack
      alignItems="center"
      backgroundColor="#094b7e"
      paddingTop={60}
      paddingBottom="$6"
    >
      <YStack>
        <Avatar circular size="$12">
          {/* Solo mostrar imagen si avatar tiene valor */}
          {avatar && <Avatar.Image key={avatar} src={avatar} />}
          <Avatar.Fallback
            backgroundColor="#fff"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              color="#3483fa"
              fontSize={48}
              fontWeight="bold"
              textAlign="center"
            >
              {name[0]?.toUpperCase() || "U"}
            </Text>
          </Avatar.Fallback>
        </Avatar>
        {/* Botón de edición con estilo moderno */}
        <YStack
          position="absolute"
          bottom={0}
          right={0}
          backgroundColor="#ffffff"
          padding="$2.5"
          borderRadius="$10"
          borderWidth={3}
          borderColor="#3483fa"
          pressStyle={{ scale: 0.95, backgroundColor: "#f8f9fa" }}
          onPress={() =>
            !isUploading && showImagePickerOptions(handleAvatarChange)
          }
          disabled={isUploading}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.2}
          shadowRadius={3}
          elevation={4}
        >
          {isUploading ? (
            <Spinner color="#3483fa" size="small" />
          ) : (
            <Feather name="camera" size={18} color="#3483fa" />
          )}
        </YStack>
      </YStack>

      <Text fontSize={24} fontWeight="700" color="#ffffff" marginTop="$4">
        {name}
      </Text>
      <Text fontSize={15} color="rgba(255,255,255,0.9)" marginTop="$1.5">
        {email}
      </Text>
    </YStack>
  );
}
