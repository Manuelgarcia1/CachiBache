import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ENV } from '../config/env';

// Interfaces
export interface GoogleAuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  };
}

export interface BackendAuthResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  };
}

/**
 * Servicio de autenticación con Google OAuth
 */
class AuthService {
  constructor() {
    // Configurar Google Sign-In
    GoogleSignin.configure({
      webClientId: ENV.GOOGLE_OAUTH.WEB_CLIENT_ID, // Necesario para obtener idToken
      offlineAccess: false,
    });
  }

  /**
   * Inicia el flujo de autenticación con Google
   * @returns Información del usuario y token JWT del backend
   */
  async loginWithGoogle(): Promise<GoogleAuthResponse> {
    try {
      // 1. Verificar si Google Play Services está disponible
      await GoogleSignin.hasPlayServices();

      // 2. Iniciar sesión con Google
      const userInfo = await GoogleSignin.signIn();

      // 3. Obtener el idToken
      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        throw new Error('No se pudo obtener el token de Google');
      }

      console.log('✅ Token de Google obtenido');

      // 4. Enviar el idToken al backend para validación
      const backendResponse = await this.validateGoogleTokenWithBackend(idToken);

      return {
        accessToken: backendResponse.accessToken,
        user: backendResponse.user,
      };
    } catch (error: any) {
      console.error('❌ Error en loginWithGoogle:', error);

      if (error.code === 'SIGN_IN_CANCELLED') {
        throw new Error('Autenticación cancelada');
      } else if (error.code === 'IN_PROGRESS') {
        throw new Error('Autenticación en progreso');
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services no disponible');
      }

      throw error;
    }
  }

  /**
   * Envía el idToken de Google al backend para validación
   * @param idToken Token de Google
   * @returns Respuesta del backend con JWT y datos del usuario
   */
  private async validateGoogleTokenWithBackend(
    idToken: string,
  ): Promise<BackendAuthResponse> {
    try {
      const response = await fetch(`${ENV.API_URL}/auth/google/mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error al validar con el backend',
        );
      }

      const data: BackendAuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error al validar token con backend:', error);
      throw error;
    }
  }

  /**
   * Cierra sesión de Google
   */
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      console.log('✅ Sesión de Google cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar sesión de Google:', error);
    }
  }
}

// Exportar instancia única del servicio
export const authService = new AuthService();
