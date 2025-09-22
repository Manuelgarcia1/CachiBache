import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { ImagePickerResult } from "../types";

export const useImagePicker = () => {
  const [isPickingImage, setIsPickingImage] = useState(false);

  const pickImageFromGallery = async (): Promise<ImagePickerResult> => {
    setIsPickingImage(true);

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Necesitamos acceso a tu galería para adjuntar fotos"
        );
        return { error: "Permisos de galería denegados" };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return { uri: result.assets[0].uri };
      }

      return { error: "Selección de imagen cancelada" };
    } catch (error) {
      console.error("Error al seleccionar imagen de galería:", error);
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
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return { uri: result.assets[0].uri };
      }

      return { error: "Captura de foto cancelada" };
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto");
      return { error: "Error al tomar la foto" };
    } finally {
      setIsPickingImage(false);
    }
  };

  const showImagePickerOptions = (onImageSelected: (uri: string) => void) => {
    Alert.alert(
      "Seleccionar imagen",
      "Elige una opción para agregar la foto del bache",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
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
