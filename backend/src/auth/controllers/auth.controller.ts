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
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { EmailVerificationService } from '../services/email-verification.service';
import { HtmlResponseService } from '../../common/services/html-response.service';
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
    private readonly htmlResponseService: HtmlResponseService,
  ) {}

  // ✨ --- NUEVO ENDPOINT DE REGISTRO --- ✨
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 registros por hora
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    message: string;
    user: UserWithoutPassword;
    accessToken: string;
  }> {
    const { accessToken, user } =
      await this.authService.register(registerUserDto);

    // Enviar token en cookie httpOnly (para seguridad web)
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Automático según entorno
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    // También devolver el token en el body (para React Native y verificación local)
    return { message: 'Registro exitoso', user, accessToken };
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    message: string;
    user: UserWithoutPassword;
    accessToken: string;
  }> {
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { accessToken } = this.authService.login(user);

    // Enviar token en cookie httpOnly (para seguridad web)
    response.cookie('accessToken', accessToken, {
      httpOnly: true, // El frontend no puede leer esta cookie
      secure: process.env.NODE_ENV === 'production', // Automático según entorno
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600 * 1000), // 1 hora
    });

    // También devolver el token en el body (para React Native y verificación local)
    return { message: 'Login exitoso', user, accessToken };
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

  /**
   * Endpoint GET para verificar email desde el navegador
   * Este endpoint es llamado cuando el usuario hace clic en el enlace del email
   */
  @Get('verify-email')
  async verifyEmailFromBrowser(
    @Query('token') token: string,
    @Res() response: Response,
  ): Promise<void> {
    try {
      await this.emailVerificationService.verifyEmail(token);
      const successPage =
        this.htmlResponseService.getEmailVerificationSuccessPage();
      response.send(successPage);
    } catch (error) {
      const errorPage = this.htmlResponseService.getEmailVerificationErrorPage(
        error.message || 'No se pudo verificar tu email.',
      );
      response.status(400).send(errorPage);
    }
  }

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
