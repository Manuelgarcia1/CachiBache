import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // Define el prefijo de la ruta para todos los endpoints de este controlador
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Maneja las peticiones POST a /users
  create(@Body() createUserDto: CreateUserDto) {
    // 1. El decorador @Body() extrae el cuerpo de la petición
    // 2. NestJS automáticamente valida el cuerpo contra el CreateUserDto
    return this.usersService.create(createUserDto);
  }
}