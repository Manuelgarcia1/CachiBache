import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '@users/services/users.service';
import { type UserWithoutPassword } from '@users/entities/user.entity';

// Extendemos el tipo Request para incluir cookies tipadas
interface RequestWithCookies extends Request {
  cookies: {
    accessToken?: string;
  } & Record<string, any>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_SECRET no está definido en las variables de entorno',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Primero intentar desde el header Authorization (para React Native y API calls)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // 2. Si no hay, intentar desde cookies (para navegadores web)
        (request: RequestWithCookies): string | null => {
          return request?.cookies?.accessToken ?? null;
        },
        // 3. Si no hay, intentar desde query parameter 'token' (para PDFs en navegador móvil)
        (request: Request): string | null => {
          return (request.query?.token as string) ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role?: string;
  }): Promise<UserWithoutPassword> {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    // En lugar de crear un nuevo objeto, eliminamos la propiedad sensible
    // de la instancia original y la retornamos.
    delete user.password;
    return user as UserWithoutPassword;
  }
}
