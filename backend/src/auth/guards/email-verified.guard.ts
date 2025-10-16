import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Guard que verifica si el usuario ha verificado su email
 * Debe usarse DESPUÉS de JwtAuthGuard para tener acceso al usuario
 *
 * Uso:
 * @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
 */
@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'No se pudo verificar tu identidad. Por favor, inicia sesión nuevamente.',
      );
    }

    if (!user.emailVerified) {
      throw new ForbiddenException(
        'Debes verificar tu email antes de realizar esta acción. Revisa tu correo electrónico.',
      );
    }

    return true;
  }
}
