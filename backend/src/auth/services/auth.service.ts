import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { type UserWithoutPassword } from '../../users/entities/user.entity';
import { type GoogleProfile } from '../strategies/google.strategy';

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
  ) {}

  // ✨ --- NUEVO MÉTODO DE REGISTRO --- ✨
  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    // 1. Verificar si el usuario ya existe
    const existingUser = await this.usersService.findOneByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    // 2. Crear el nuevo usuario usando UsersService
    const newUser = await this.usersService.create(registerUserDto);

    // 3. Iniciar sesión automáticamente al nuevo usuario
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
      user, // Devolvemos también el usuario
    };
  }

  async validateGoogleUser(
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
}
