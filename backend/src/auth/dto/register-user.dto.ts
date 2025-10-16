import {
  IsEmail,
  IsString,
  MinLength,
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
  @Matches(/^\+54\s9\s\d{2,4}\s\d{4}-\d{4}$/, {
    message: 'El formato del teléfono debe ser "+54 9 XX XXXX-XXXX"',
  })
  phone?: string;

  @IsBoolean()
  @Equals(true, { message: 'Debes aceptar los términos y condiciones' })
  termsAccepted: boolean;
}
