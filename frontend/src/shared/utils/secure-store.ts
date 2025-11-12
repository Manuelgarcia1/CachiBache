import * as SecureStore from 'expo-secure-store';

// Claves únicas para identificar los tokens en el almacenamiento seguro del dispositivo
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// ==================== ACCESS TOKEN ====================

// Guarda el access token de autenticación de forma segura en el dispositivo
export const setToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error guardando access token:', error);
  }
};

// Recupera el access token guardado desde el almacenamiento seguro
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error leyendo access token:', error);
    return null;
  }
};

// Elimina el access token del almacenamiento seguro (usado en logout)
export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error eliminando access token:', error);
  }
};

// ==================== REFRESH TOKEN ====================

// Guarda el refresh token de forma segura en el dispositivo
export const setRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error guardando refresh token:', error);
  }
};

// Recupera el refresh token guardado desde el almacenamiento seguro
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error leyendo refresh token:', error);
    return null;
  }
};

// Elimina el refresh token del almacenamiento seguro (usado en logout)
export const deleteRefreshToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error eliminando refresh token:', error);
  }
};