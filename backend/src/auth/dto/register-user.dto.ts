import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  Matches,
  ValidateIf,
  Equals,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  // El nombre completo es requerido solo si no es un registro con Google
  @ValidateIf((o: RegisterUserDto) => !o.googleId)
  @IsString()
  fullName: string;

  // La contraseña es requerida solo si no es un registro con Google
  @ValidateIf((o: RegisterUserDto) => !o.googleId)
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  // El teléfono es opcional, pero si se envía, debe cumplir el formato
  @IsOptional()
  @Matches(/^\+54\s9\s\d{2,4}\s\d{4}-\d{4}$/, {
    message: 'El formato del teléfono debe ser "+54 9 XX XXXX-XXXX"',
  })
  phone?: string;

  // El googleId es opcional
  @IsOptional()
  @IsString()
  googleId?: string;

  // La aceptación de términos es requerida solo si no es un registro con Google
  @ValidateIf((o: RegisterUserDto) => !o.googleId)
  @IsBoolean()
  @Equals(true, { message: 'Debes aceptar los términos y condiciones' })
  termsAccepted: boolean;
}
