// Servicio HTTP reutilizable para todas las peticiones a la API
import { API_BASE_URL, DEFAULT_HEADERS, API_TIMEOUT } from '../config/api';

/**
 * Clase de error personalizada para errores de API
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Opciones para las peticiones HTTP
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Servicio centralizado para realizar peticiones HTTP
 */
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Realiza una petición HTTP con timeout y manejo de errores
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = API_TIMEOUT,
    } = options;

    const url = `${this.baseURL}${endpoint}`;

    // Configuración del AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...DEFAULT_HEADERS,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        credentials: 'include', // Importante para enviar/recibir cookies
      });

      clearTimeout(timeoutId);

      // Parsear respuesta JSON
      const data = await response.json();

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.message || 'Error en la petición',
          data.errors
        );
      }

      return data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Manejar timeout
      if (error.name === 'AbortError') {
        throw new ApiError(
          408,
          'La petición tardó demasiado tiempo. Por favor, intenta nuevamente.'
        );
      }

      // Manejar error de red
      if (error instanceof TypeError) {
        throw new ApiError(
          0,
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
        );
      }

      // Re-lanzar errores de API
      if (error instanceof ApiError) {
        throw error;
      }

      // Error desconocido
      throw new ApiError(500, 'Ocurrió un error inesperado');
    }
  }

  /**
   * Método GET
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  /**
   * Método POST
   */
  async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  /**
   * Método PUT
   */
  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  /**
   * Método PATCH
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }

  /**
   * Método DELETE
   */
  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Exportar instancia singleton del servicio
export const apiService = new ApiService(API_BASE_URL);
