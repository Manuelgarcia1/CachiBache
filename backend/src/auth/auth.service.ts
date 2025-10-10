import { ConflictException, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { classToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    // ✨ --- NUEVO MÉTODO DE REGISTRO --- ✨
    async register(registerUserDto: RegisterUserDto) {
        // 1. Verificar si el usuario ya existe
        const existingUser = await this.usersService.findOneByEmail(registerUserDto.email);
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

    async validateUser(loginUserDto: LoginUserDto): Promise<any> {
        const { email, password } = loginUserDto;
        const user = await this.usersService.findOneByEmail(email);

        if (user && (await user.validatePassword(password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user; // Remover la contraseña del objeto
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
            user, // Devolvemos también el usuario
        };
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Actualizar solo los campos proporcionados en el DTO
        Object.assign(user, updateProfileDto);

        const updatedUser = await this.usersService.save(user);
        return classToPlain(updatedUser);
    }
}
