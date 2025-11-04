// Servicio HTTP reutilizable para todas las peticiones a la API usando axios
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL, DEFAULT_HEADERS, API_TIMEOUT } from "../config/api";
import { getRefreshToken, setToken, getToken } from "../utils/secure-store";

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
    this.name = "ApiError";
  }
}

// Variable para evitar múltiples llamadas simultáneas al endpoint de refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
];

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

    // Interceptor de REQUEST para agregar token automáticamente
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Si ya hay un token en el header (ej: después de refresh), no lo sobreescribas
        if (config.headers?.Authorization) {
          return config;
        }

        // Verificar si la ruta es pública (no requiere autenticación)
        const isPublicRoute = PUBLIC_ROUTES.some((route) =>
          config.url?.includes(route)
        );
        if (isPublicRoute) {
          return config; // No agregar token a rutas públicas
        }

        // Obtener el token actual de SecureStore
        try {
          const token = await getToken();

          // Si hay token, agregarlo al header Authorization
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("❌ Error obteniendo token:", error);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de respuesta para manejo global de errores y refresh automático
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<any>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Manejar timeout
        if (error.code === "ECONNABORTED") {
          throw new ApiError(
            408,
            "La petición tardó demasiado tiempo. Por favor, intenta nuevamente."
          );
        }

        // Manejar error de red
        if (!error.response) {
          throw new ApiError(
            0,
            "No se pudo conectar con el servidor. Verifica tu conexión a internet."
          );
        }

        const statusCode = error.response.status;

        // Si es 401 (Unauthorized) y no es el endpoint de refresh, intentar refrescar el token
        if (
          statusCode === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/refresh")
        ) {
          originalRequest._retry = true;

          try {
            // Si ya se está refrescando, esperar a que termine
            if (isRefreshing) {
              return new Promise((resolve) => {
                refreshSubscribers.push((token: string) => {
                  resolve(
                    this.axiosInstance({
                      ...originalRequest,
                      headers: {
                        ...originalRequest.headers,
                        Authorization: `Bearer ${token}`,
                      },
                    })
                  );
                });
              });
            }

            isRefreshing = true;
            console.log(
              "🔄 REFRESH TOKEN: Token expirado, renovando sesión automáticamente..."
            );

            // Obtener refresh token de SecureStore
            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
              throw new Error("No hay refresh token disponible");
            }

            // Llamar al endpoint de refresh
            const response = await this.axiosInstance.post<{
              accessToken: string;
            }>("/auth/refresh", { refreshToken });

            const newAccessToken = response.data.accessToken;
            await setToken(newAccessToken);

            console.log("✅ REFRESH TOKEN: Sesión renovada exitosamente");

            // Notificar a todas las peticiones en espera
            refreshSubscribers.forEach((callback) => callback(newAccessToken));
            refreshSubscribers = [];
            isRefreshing = false;

            // Reintentar la petición original con el nuevo token
            return this.axiosInstance({
              ...originalRequest,
              headers: {
                ...originalRequest.headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
          } catch (refreshError) {
            isRefreshing = false;
            refreshSubscribers = [];
            console.error(
              "❌ REFRESH TOKEN: Error renovando sesión, debes iniciar sesión nuevamente"
            );
            throw new ApiError(
              401,
              "Sesión expirada. Por favor, inicia sesión nuevamente."
            );
          }
        }

        // Manejar otros errores HTTP (4xx, 5xx)
        const message = error.response.data?.message || "Error en la petición";
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
    const response = await this.axiosInstance.post<T>(endpoint, body, {
      headers,
    });
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
    const response = await this.axiosInstance.put<T>(endpoint, body, {
      headers,
    });
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
    const response = await this.axiosInstance.patch<T>(endpoint, body, {
      headers,
    });
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

  /**
   * Método GET para obtener Blobs (archivos binarios como PDFs, imágenes, etc.)
   */
  async getBlob(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<Blob> {
    const response = await this.axiosInstance.get(endpoint, {
      headers,
      responseType: "blob", // Importante: indicar que esperamos un blob
    });
    return response.data;
  }
}

// Exportar instancia singleton del servicio
export const apiService = new ApiService(API_BASE_URL);
