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
  role: 'CIUDADANO' | 'ADMIN';
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
      const response = await apiService.get<{ user: User }>('/users/me');
      return response.user;
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

  /**
   * Solicita recuperación de contraseña
   * @param email - Email del usuario
   * @returns Promise con mensaje de confirmación
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      console.log('[AuthService] Iniciando requestPasswordReset para:', email);
      console.log('[AuthService] Llamando a apiService.post...');

      const response = await apiService.post<{ message: string }>(
        '/auth/forgot-password',
        { email }
      );

      console.log('[AuthService] Respuesta recibida:', response);
      return response;
    } catch (error: any) {
      console.error('[AuthService] Error capturado:', error);
      console.error('[AuthService] Error.message:', error.message);
      console.error('[AuthService] Error completo:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  /**
   * Valida un token de recuperación de contraseña
   * @param token - Token de recuperación
   * @returns Promise con validez del token
   */
  async validateResetToken(token: string): Promise<{ valid: boolean }> {
    try {
      const response = await apiService.get<{ valid: boolean }>(
        `/auth/validate-reset-token/${token}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Restablece la contraseña usando un token válido
   * @param token - Token de recuperación
   * @param newPassword - Nueva contraseña
   * @param confirmPassword - Confirmación de contraseña
   * @returns Promise con mensaje de confirmación
   */
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await apiService.post<{ message: string }>(
        '/auth/reset-password',
        { token, newPassword, confirmPassword }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Inicia sesión con Google OAuth
   * @param idToken - ID Token de Google obtenido del cliente
   * @returns Promise con la respuesta de autenticación
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        '/auth/google',
        { idToken }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Exportar instancia singleton del servicio
export const authService = new AuthService();
