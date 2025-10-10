import { Controller, Post, Body, Res, UnauthorizedException, UseGuards, Get, Patch } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth') // Ruta base es /api/auth
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // ✨ --- NUEVO ENDPOINT DE REGISTRO --- ✨
    @Post('register')
    async register(
        @Body() registerUserDto: RegisterUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const { accessToken, user } = await this.authService.register(registerUserDto);

        response.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 3600 * 1000), // 1 hora
        });

        return { message: 'Registro exitoso', user };
    }

    @Post('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const user = await this.authService.validateUser(loginUserDto);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const { accessToken } = await this.authService.login(user);

        response.cookie('accessToken', accessToken, {
            httpOnly: true, // El frontend no puede leer esta cookie
            secure: false, // En producción debería ser true (solo HTTPS)
            sameSite: 'lax',
            expires: new Date(Date.now() + 3600 * 1000), // 1 hora
        });

        return { message: 'Login exitoso', user };
    }
    @Post('logout')
    @UseGuards(JwtAuthGuard) // 2. Proteger la ruta
    logout(@Res({ passthrough: true }) response: Response) {
        // 3. Limpiar la cookie
        response.clearCookie('accessToken');
        return { message: 'Sesión cerrada exitosamente' };
    }

    @Get('user')
    @UseGuards(JwtAuthGuard)
    getUser(@GetUser() user: User) {
        return user;
    }

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(
        @GetUser() user: User,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.authService.updateProfile(user.id, updateProfileDto);
    }
}
