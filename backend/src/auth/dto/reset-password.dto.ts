import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'El token es requerido' })
  @IsString()
  token: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  newPassword: string;

  @IsNotEmpty({ message: 'La confirmación de contraseña es requerida' })
  @IsString()
  confirmPassword: string;
}
