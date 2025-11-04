import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type UserWithoutPassword } from '@users/entities/user.entity';

// Extendemos el tipo Request para incluir la propiedad user que agrega Passport
interface RequestWithUser {
  user: UserWithoutPassword;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserWithoutPassword => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
