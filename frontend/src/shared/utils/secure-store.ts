import * as SecureStore from 'expo-secure-store';

// Clave única para identificar el token en el almacenamiento seguro del dispositivo
const TOKEN_KEY = 'auth_token';

// Guarda el token de autenticación de forma segura en el dispositivo
export const setToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error guardando token:', error);
  }
};

// Recupera el token guardado desde el almacenamiento seguro
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log('Token leído de SecureStore:', token);
    return token;
  } catch (error) {
    console.error('Error leyendo token:', error);
    return null;
  }
};

// Elimina el token del almacenamiento seguro (usado en logout)
export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log('Token eliminado de SecureStore');
  } catch (error) {
    console.error('Error eliminando token:', error);
  }
};