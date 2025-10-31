import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'El formato del email no es válido.' })
  @IsString({ message: 'El email debe ser un texto.' })
  @IsNotEmpty({ message: 'El email es requerido.' })
  email: string;
}
