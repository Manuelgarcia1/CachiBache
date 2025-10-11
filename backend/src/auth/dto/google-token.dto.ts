import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para validar el idToken de Google enviado desde la app mobile
 */
export class GoogleTokenDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
