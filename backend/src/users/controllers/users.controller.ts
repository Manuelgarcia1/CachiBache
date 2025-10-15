import { Controller } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users') // Define el prefijo de la ruta para todos los endpoints de este controlador
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
