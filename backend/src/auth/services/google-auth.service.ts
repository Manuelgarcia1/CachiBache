import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

/**
 * GoogleAuthService
 * Servicio especializado para manejar la autenticación con Google OAuth 2.0
 * Responsabilidades:
 * - Validar tokens ID de Google
 * - Extraer información del usuario desde el token
 */
@Injectable()
export class GoogleAuthService {
  private googleClient: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    // Inicializar el cliente de Google OAuth con el Client ID
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      console.warn(
        '⚠️ GOOGLE_CLIENT_ID no está configurado. La autenticación con Google no funcionará.',
      );
    }
    this.googleClient = new OAuth2Client(clientId);
  }

  /**
   * Valida un ID Token de Google y extrae la información del usuario
   * @param idToken - Token ID recibido desde el cliente (Android/iOS/Web)
   * @returns Información del usuario verificada por Google
   * @throws UnauthorizedException si el token es inválido
   */
  async verifyGoogleToken(idToken: string): Promise<{
    email: string;
    fullName: string;
    profilePicture?: string;
    emailVerified: boolean;
  }> {
    try {
      // Verificar el token con Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Token de Google inválido');
      }

      // Extraer información del usuario
      const { email, name, picture, email_verified } = payload;

      if (!email) {
        throw new UnauthorizedException(
          'No se pudo obtener el email del usuario de Google',
        );
      }

      return {
        email: email.toLowerCase().trim(),
        fullName: name || 'Usuario de Google',
        profilePicture: picture,
        emailVerified: email_verified || false,
      };
    } catch (error) {
      console.error('❌ Error verificando token de Google:', error.message);
      throw new UnauthorizedException(
        'Token de Google inválido o expirado. Por favor, intenta iniciar sesión nuevamente.',
      );
    }
  }
}
