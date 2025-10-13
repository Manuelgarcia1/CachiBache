import Constants from 'expo-constants';
import { Platform } from 'react-native';

const extra = Constants.expoConfig?.extra || {};

// Detectar si estamos en emulador o dispositivo físico
const getApiUrl = () => {
  // Obtener la IP local desde variables de entorno
  // Cada desarrollador debe configurar su propia IP en .env.local
  const localIp = process.env.LOCAL_IP || '192.168.0.19';

  // En desarrollo, usar la IP local de la PC para dispositivos físicos
  // y 10.0.2.2 para el emulador de Android
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Si es Android, verificar si es emulador o dispositivo físico
      // En emulador: usar 10.0.2.2
      // En dispositivo físico: usar IP local de la PC
      const isEmulator = Constants.isDevice === false;
      return isEmulator
        ? 'http://10.0.2.2:3000/api'
        : `http://${localIp}:3000/api`;
    }
    // Para iOS, usar localhost para simulador o IP local para dispositivo físico
    return Constants.isDevice
      ? `http://${localIp}:3000/api`
      : 'http://localhost:3000/api';
  }

  // En producción, usar la URL del backend en la nube
  return extra.apiUrl || 'https://api.cachibache.com/api';
};

export const ENV = {
  API_URL: getApiUrl(),

  GOOGLE_OAUTH: {
    WEB_CLIENT_ID: extra.googleOAuth?.webClientId || '',
    ANDROID_CLIENT_ID: extra.googleOAuth?.androidClientId || '',
    IOS_CLIENT_ID: extra.googleOAuth?.iosClientId || '',
  },
};
