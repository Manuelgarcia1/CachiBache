import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePicker = () => {
  const showImagePickerOptions = (onImageSelected: (uri: string) => void) => {
    Alert.alert(
      'Seleccionar Foto de Perfil',
      'Elige una opción',
      [
        { text: 'Tomar Foto...', onPress: async () => {
          const uri = await pickImage('camera');
          if (uri) onImageSelected(uri);
        }},
        { text: 'Elegir de la Galería...', onPress: async () => {
          const uri = await pickImage('gallery');
          if (uri) onImageSelected(uri);
        }},
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // --- 👇 CORRECCIÓN AQUÍ 👇 ---
  // pickImage ahora devuelve la URI o null, en lugar de llamar a un callback.
  const pickImage = async (source: 'camera' | 'gallery'): Promise<string | null> => {
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Forzamos un recorte cuadrado para el perfil
      quality: 0.7,
    };

    if (source === 'camera') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu cámara.');
        return null;
      }
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    
    return null;
  };

  return { showImagePickerOptions };
};