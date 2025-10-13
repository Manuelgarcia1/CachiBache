import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { GoogleProfile } from '../interfaces/google-profile.interface';
import { UsersService } from '../../users/services/users.service';
import { type UserWithoutPassword } from '../../users/entities/user.entity';

/**
 * Servicio encargado de la autenticación con Google OAuth
 * Maneja todo el flujo: validación de tokens, gestión de usuarios y generación de JWT
 */
@Injectable()
export class GoogleAuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    // Inicializar cliente de Google para validar tokens
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  /**
   * Valida un idToken de Google y extrae el perfil del usuario
   * @param idToken Token de Google obtenido desde el cliente
   * @returns Perfil del usuario de Google
   * @throws UnauthorizedException si el token es inválido
   */
  async validateIdToken(idToken: string): Promise<GoogleProfile> {
    try {
      // Validar el idToken con Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Token de Google inválido');
      }

      // Transformar payload de Google a nuestro formato
      return {
        id: payload.sub,
        email: payload.email || '',
        fullName: payload.name || '',
        avatarUrl: payload.picture || '',
      };
    } catch (error) {
      console.error('Error al validar token de Google:', error);
      throw new UnauthorizedException('No se pudo validar el token de Google');
    }
  }

  /**
   * Busca o crea un usuario basado en el perfil de Google
   * @param googleProfile Perfil del usuario de Google
   * @returns Usuario sin contraseña
   */
  private async findOrCreateUser(
    googleProfile: GoogleProfile,
  ): Promise<UserWithoutPassword> {
    // 1. Buscar usuario por googleId
    let user = await this.usersService.findOneByGoogleId(googleProfile.id);

    // 2. Si no existe, buscar por email
    if (!user) {
      user = await this.usersService.findOneByEmail(googleProfile.email);

      // 3. Si existe por email, actualizar con googleId
      if (user) {
        user.googleId = googleProfile.id;
        user.avatarUrl = googleProfile.avatarUrl;
        await this.usersService.create(user); // Actualizar usuario
      } else {
        // 4. Si no existe, crear nuevo usuario
        user = await this.usersService.create({
          email: googleProfile.email,
          fullName: googleProfile.fullName,
          googleId: googleProfile.id,
          avatarUrl: googleProfile.avatarUrl,
          termsAccepted: true, // Asumimos que aceptó términos al usar Google
        });
      }
    }

    // 5. Devolver usuario sin contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Flujo completo de autenticación con Google
   * @param idToken Token de Google desde el cliente mobile
   * @returns Usuario y token JWT de la aplicación
   */
  async authenticateWithGoogle(idToken: string): Promise<{
    user: UserWithoutPassword;
    accessToken: string;
  }> {
    // 1. Validar token con Google y obtener perfil
    const googleProfile = await this.validateIdToken(idToken);

    // 2. Buscar o crear usuario en nuestra base de datos
    const user = await this.findOrCreateUser(googleProfile);

    // 3. Generar JWT de nuestra aplicación
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { user, accessToken };
  }
}
