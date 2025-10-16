import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { EmailVerificationService } from '../services/email-verification.service';
import {
  type UserWithoutPassword,
  User,
} from '../../users/entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('auth') // Ruta base es /api/auth
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  // ✨ --- NUEVO ENDPOINT DE REGISTRO --- ✨
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 registros por hora
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string; user: UserWithoutPassword }> {
    const { accessToken, user } =
      await this.authService.register(registerUserDto);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Automático según entorno
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    return { message: 'Registro exitoso', user };
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string; user: UserWithoutPassword }> {
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { accessToken } = this.authService.login(user);

    response.cookie('accessToken', accessToken, {
      httpOnly: true, // El frontend no puede leer esta cookie
      secure: process.env.NODE_ENV === 'production', // Automático según entorno
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    return { message: 'Login exitoso', user };
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie('accessToken');
    return { message: 'Sesión cerrada exitosamente' };
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  getUser(@GetUser() user: User): User {
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

  // ✨ --- NUEVOS ENDPOINTS DE VERIFICACIÓN DE EMAIL --- ✨
  @Post('verify-email/:token')
  async verifyEmail(
    @Param('token') token: string,
  ): Promise<{ message: string; user: UserWithoutPassword }> {
    const user = await this.emailVerificationService.verifyEmail(token);
    return {
      message: 'Email verificado exitosamente',
      user,
    };
  }

  @Post('resend-verification')
  async resendVerificationEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.emailVerificationService.resendVerificationEmail(email);
    return {
      message:
        'Si el correo existe y no está verificado, se enviará un email de verificación',
    };
  }
}
