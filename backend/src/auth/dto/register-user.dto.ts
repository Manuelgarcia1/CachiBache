import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  Matches,
  Equals,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'El teléfono debe tener al menos 8 caracteres' })
  @MaxLength(20, { message: 'El teléfono no puede tener más de 20 caracteres' })
  phone?: string;

  @IsBoolean()
  @Equals(true, { message: 'Debes aceptar los términos y condiciones' })
  termsAccepted: boolean;
}
