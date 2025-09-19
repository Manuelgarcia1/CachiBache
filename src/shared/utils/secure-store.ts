import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export const setToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log('Token guardado en SecureStore:', token);
  } catch (error) {
    console.error('Error guardando token:', error);
  }
};

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

export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log('Token eliminado de SecureStore');
  } catch (error) {
    console.error('Error eliminando token:', error);
  }
};