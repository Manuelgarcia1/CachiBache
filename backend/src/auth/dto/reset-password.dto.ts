import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'El token es requerido.' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'La nueva contraseña es requerida.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'La confirmación de la contraseña es requerida.' })
  passwordConfirmation: string;
}
