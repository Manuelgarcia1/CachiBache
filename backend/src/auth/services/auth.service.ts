import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { EmailVerificationService } from './email-verification.service';
import { RefreshTokenService } from './refresh-token.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { type UserWithoutPassword } from '../../users/entities/user.entity';

// Tipo para la respuesta de autenticación
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserWithoutPassword;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  // ✨ --- NUEVO MÉTODO DE REGISTRO --- ✨
  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    // 1. Normalizar el email a minúsculas para evitar duplicados
    const normalizedEmail = registerUserDto.email.toLowerCase().trim();

    // 2. Verificar si el usuario ya existe
    const existingUser =
      await this.usersService.findOneByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException(
        'No se pudo completar el registro. Por favor, verifica tus datos e intenta nuevamente.',
      );
    }

    // 3. Crear el nuevo usuario usando UsersService con email normalizado
    const newUser = await this.usersService.create({
      ...registerUserDto,
      email: normalizedEmail,
    });

    // 4. Enviar email de verificación
    this.emailVerificationService
      .sendVerificationEmailToNewUser(newUser.id, newUser.email)
      .then(() => {
        this.logger.log(
          `Email de verificación enviado exitosamente a ${newUser.email}`,
        );
      })
      .catch((error) => {
        this.logger.error(
          `FALLO AL ENVIAR EMAIL de verificación a ${newUser.email}`,
          error.stack,
        );
        // Nota: No relanzamos el error. El registro y login deben continuar.
      });

    // 5. Iniciar sesión automáticamente al nuevo usuario
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userPayload } = newUser;
    return this.login(userPayload);
  }

  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<UserWithoutPassword | null> {
    const { email, password } = loginUserDto;
    // Normalizar el email a minúsculas para buscar correctamente
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.usersService.findOneByEmail(normalizedEmail);

    if (
      user &&
      user.password &&
      (await this.encryptionService.comparePasswords(password, user.password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user; // Remover la contraseña del objeto
      return result;
    }
    return null;
  }

  async login(user: UserWithoutPassword): Promise<AuthResponse> {
    const payload = { email: user.email, sub: user.id, role: user.role };

    // Generar access token (corta duración)
    const accessToken = this.jwtService.sign(payload);

    // IMPORTANTE: Revocar todos los refresh tokens anteriores del usuario
    // para asegurar que solo exista una sesión activa
    await this.refreshTokenService.revokeAllUserTokens(user.id);

    // Generar refresh token (larga duración) y guardarlo en DB
    const refreshTokenEntity =
      await this.refreshTokenService.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken: refreshTokenEntity.token,
      user,
    };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    // Delegar la responsabilidad al UsersService
    return await this.usersService.updateProfile(userId, updateProfileDto);
  }

  /**
   * Refresca el access token usando un refresh token válido
   * @param refreshToken - Refresh token del usuario
   * @returns Nuevo access token
   */
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    // Validar el refresh token
    const refreshTokenEntity =
      await this.refreshTokenService.validateRefreshToken(refreshToken);

    // Generar nuevo access token
    const payload = {
      email: refreshTokenEntity.user.email,
      sub: refreshTokenEntity.user.id,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * Revoca un refresh token específico (logout en un dispositivo)
   * @param refreshToken - Token a revocar
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revokeToken(refreshToken);
  }

  /**
   * Revoca todos los refresh tokens de un usuario (logout en todos los dispositivos)
   * @param userId - ID del usuario
   */
  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenService.revokeAllUserTokens(userId);
  }
}
