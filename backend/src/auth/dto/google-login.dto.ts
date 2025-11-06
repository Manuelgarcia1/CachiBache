import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para login con Google OAuth
 * Recibe el ID Token generado por Google Sign-In en el cliente
 */
export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'El ID Token de Google es requerido' })
  idToken: string;
}
