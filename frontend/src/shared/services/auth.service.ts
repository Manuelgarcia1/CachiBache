// Servicio de autenticación: maneja registro, login y operaciones relacionadas
import { apiService } from './api.service';

/**
 * Interfaces para DTOs de autenticación
 */

// DTO para registro de usuario
export interface RegisterDto {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  termsAccepted: boolean;
}

// DTO para login
export interface LoginDto {
  email: string;
  password: string;
}

// Usuario sin contraseña (respuesta del backend)
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  profilePicture?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string; // Token JWT de corta duración (1 hora)
  refreshToken: string; // Token de larga duración para refrescar el accessToken (30 días)
}

/**
 * Servicio de Autenticación
 * Maneja todas las operaciones relacionadas con autenticación de usuarios
 */
class AuthService {
  /**
   * Registra un nuevo usuario en el sistema
   * @param registerData - Datos del usuario a registrar
   * @returns Promise con la respuesta de autenticación
   */
  async register(registerData: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        '/auth/register',
        registerData
      );
      return response;
    } catch (error) {
      // El error ya viene formateado por ApiService
      throw error;
    }
  }

  /**
   * Inicia sesión de un usuario existente
   * @param loginData - Credenciales del usuario
   * @returns Promise con la respuesta de autenticación
   */
  async login(loginData: LoginDto): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        '/auth/login',
        loginData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual
   * @returns Promise con mensaje de confirmación
   */
  async logout(): Promise<{ message: string }> {
    try {
      const response = await apiService.post<{ message: string }>(
        '/auth/logout'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene información del usuario autenticado
   * @returns Promise con datos del usuario
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>('/auth/user');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verifica el email del usuario
   * @param token - Token de verificación enviado por email
   * @returns Promise con respuesta de verificación
   */
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        `/auth/verify-email/${token}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reenvía el email de verificación
   * @param email - Email del usuario
   * @returns Promise con mensaje de confirmación
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await apiService.post<{ message: string }>(
        '/auth/resend-verification',
        { email }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresca el access token usando un refresh token válido
   * @param refreshToken - Refresh token almacenado
   * @returns Promise con el nuevo access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const response = await apiService.post<{ accessToken: string }>(
        '/auth/refresh',
        { refreshToken }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Exportar instancia singleton del servicio
export const authService = new AuthService();
