import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@users/entities/user-role.enum';

/**
 * Guard para proteger rutas exclusivas de administradores
 * Verifica que el usuario autenticado tenga rol ADMIN
 * Debe usarse junto con JwtAuthGuard
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar que exista usuario (debe pasar por JwtAuthGuard primero)
    if (!user) {
      throw new ForbiddenException('No se encontró información del usuario');
    }

    // Verificar que el usuario tenga rol ADMIN
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso. Solo administradores.',
      );
    }

    return true;
  }
}
