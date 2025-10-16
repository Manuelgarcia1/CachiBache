import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { EmailVerificationService } from './email-verification.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { type UserWithoutPassword } from '../../users/entities/user.entity';

// Tipo para la respuesta de autenticación
export interface AuthResponse {
  accessToken: string;
  user: UserWithoutPassword;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  // ✨ --- NUEVO MÉTODO DE REGISTRO --- ✨
  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    // 1. Verificar si el usuario ya existe
    const existingUser = await this.usersService.findOneByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException(
        'No se pudo completar el registro. Por favor, verifica tus datos e intenta nuevamente.',
      );
    }

    // 2. Crear el nuevo usuario usando UsersService
    const newUser = await this.usersService.create(registerUserDto);

    // 3. Enviar email de verificación
    await this.emailVerificationService.sendVerificationEmailToNewUser(
      newUser.id,
      newUser.email,
    );

    // 4. Iniciar sesión automáticamente al nuevo usuario
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userPayload } = newUser;
    return this.login(userPayload);
  }

  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<UserWithoutPassword | null> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findOneByEmail(email);

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

  login(user: UserWithoutPassword): AuthResponse {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
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
}
