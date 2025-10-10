import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // Define el prefijo de la ruta para todos los endpoints de este controlador
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

}