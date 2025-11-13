// Configuración central de la API
// Este archivo contiene la URL base y configuraciones compartidas para todas las llamadas HTTP con axios

/**
 * URL base del backend
 * Se obtiene de variables de entorno (.env)
 * Fallback a localhost si no está configurada
 *
 * Para actualizar la URL:
 * 1. Edita el archivo .env en la raíz del proyecto frontend
 * 2. Actualiza EXPO_PUBLIC_API_URL con tu IP local
 * 3. Reinicia el servidor de desarrollo (Expo)
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Headers por defecto para todas las peticiones HTTP
 * Estos headers se configuran en la instancia de axios
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Timeout para peticiones HTTP (en milisegundos)
 * Se aplica globalmente a todas las peticiones de axios
 * Aumentado a 60 segundos para operaciones que envían emails
 */
export const API_TIMEOUT = 60000; // 60 segundos
