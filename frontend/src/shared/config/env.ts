/**
 * Configuración de variables de entorno
 * Centraliza el acceso a todas las variables de entorno de la aplicación
 */

import Constants from 'expo-constants';

/**
 * Obtiene una variable de entorno de forma segura
 * @param key - Nombre de la variable de entorno (sin el prefijo EXPO_PUBLIC_)
 * @param required - Si es true, lanza un error si la variable no existe
 * @returns El valor de la variable o undefined
 */
function getEnvVar(key: string, required: boolean = false): string | undefined {
  const value = Constants.expoConfig?.extra?.[key];

  if (required && !value) {
    throw new Error(
      `❌ Variable de entorno requerida no encontrada: ${key}\n` +
      `Asegúrate de que EXPO_PUBLIC_${key} esté definida en tu archivo .env`
    );
  }

  return value;
}

/**
 * Configuración de la aplicación
 */
export const env = {
  // Backend API URL
  apiUrl: getEnvVar('API_URL', true) as string,

  // Cloudinary
  cloudinaryCloudName: getEnvVar('CLOUDINARY_CLOUD_NAME', true) as string,

  // Google Maps
  googleMapsApiKey: getEnvVar('GOOGLE_MAPS_API_KEY', true) as string,

  // Google OAuth
  googleWebClientId: getEnvVar('GOOGLE_WEB_CLIENT_ID', true) as string,
};

/**
 * Valida que todas las variables de entorno requeridas estén configuradas
 */
export function validateEnv(): void {
  const requiredVars = [
    'API_URL',
    'CLOUDINARY_CLOUD_NAME',
    'GOOGLE_MAPS_API_KEY',
    'GOOGLE_WEB_CLIENT_ID',
  ];

  const missing = requiredVars.filter(
    key => !Constants.expoConfig?.extra?.[key]
  );

  if (missing.length > 0) {
    console.error(
      '❌ Variables de entorno faltantes:\n' +
      missing.map(key => `  - EXPO_PUBLIC_${key}`).join('\n') +
      '\n\nAsegúrate de tener un archivo .env con todas las variables requeridas.'
    );
  }
}
