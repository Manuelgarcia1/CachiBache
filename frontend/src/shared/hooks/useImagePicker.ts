import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { useState } from "react";

export interface ImagePickerResult {
  uri?: string;
  error?: string;
}

export interface UseImagePickerOptions {
  aspectRatio?: [number, number];
  quality?: number;
  title?: string;
  message?: string;
}

export const useImagePicker = (options?: UseImagePickerOptions) => {
  const [isPickingImage, setIsPickingImage] = useState(false);

  const {
    aspectRatio = [1, 1],
    quality = 0.8,
    title = "Seleccionar imagen",
    message = "Elige una opción",
  } = options || {};

  const pickImageFromGallery = async (): Promise<ImagePickerResult> => {
    setIsPickingImage(true);

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Necesitamos acceso a tu galería para seleccionar fotos"
        );
        return { error: "Permisos de galería denegados" };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: aspectRatio,
        quality,
      });

      if (!result.canceled && result.assets[0]) {
        return { uri: result.assets[0].uri };
      }

      return { error: "Selección de imagen cancelada" };
    } catch (error) {
      Alert.alert(
        "Error",
        `No se pudo seleccionar la imagen: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
      return { error: "Error al seleccionar imagen de galería" };
    } finally {
      setIsPickingImage(false);
    }
  };

  const takePhoto = async (): Promise<ImagePickerResult> => {
    setIsPickingImage(true);

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Necesitamos acceso a tu cámara para tomar fotos"
        );
        return { error: "Permisos de cámara denegados" };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: aspectRatio,
        quality,
      });

      if (!result.canceled && result.assets[0]) {
        return { uri: result.assets[0].uri };
      }

      return { error: "Captura de foto cancelada" };
    } catch {
      Alert.alert("Error", "No se pudo tomar la foto");
      return { error: "Error al tomar la foto" };
    } finally {
      setIsPickingImage(false);
    }
  };

  const showImagePickerOptions = (onImageSelected: (uri: string) => void) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Tomar foto",
          onPress: async () => {
            const result = await takePhoto();
            if (result.uri) {
              onImageSelected(result.uri);
            }
          },
        },
        {
          text: "Elegir de galería",
          onPress: async () => {
            const result = await pickImageFromGallery();
            if (result.uri) {
              onImageSelected(result.uri);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return {
    pickImageFromGallery,
    takePhoto,
    showImagePickerOptions,
    isPickingImage,
  };
};
