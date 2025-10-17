// Servicio HTTP reutilizable para todas las peticiones a la API usando axios
import axios, { AxiosInstance, AxiosError } from 'axios';
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
 * Servicio centralizado para realizar peticiones HTTP con axios
 */
class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    // Crear instancia de axios con configuración global
    this.axiosInstance = axios.create({
      baseURL,
      timeout: API_TIMEOUT,
      headers: DEFAULT_HEADERS,
      withCredentials: true, // Importante para enviar/recibir cookies
    });

    // Interceptor de respuesta para manejo global de errores
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<any>) => {
        // Manejar timeout
        if (error.code === 'ECONNABORTED') {
          throw new ApiError(
            408,
            'La petición tardó demasiado tiempo. Por favor, intenta nuevamente.'
          );
        }

        // Manejar error de red
        if (!error.response) {
          throw new ApiError(
            0,
            'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
          );
        }

        // Manejar errores HTTP (4xx, 5xx)
        const statusCode = error.response.status;
        const message = error.response.data?.message || 'Error en la petición';
        const errors = error.response.data?.errors;

        throw new ApiError(statusCode, message, errors);
      }
    );
  }

  /**
   * Método GET
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, { headers });
    return response.data;
  }

  /**
   * Método POST
   */
  async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, body, { headers });
    return response.data;
  }

  /**
   * Método PUT
   */
  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, body, { headers });
    return response.data;
  }

  /**
   * Método PATCH
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, body, { headers });
    return response.data;
  }

  /**
   * Método DELETE
   */
  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint, { headers });
    return response.data;
  }
}

// Exportar instancia singleton del servicio
export const apiService = new ApiService(API_BASE_URL);
