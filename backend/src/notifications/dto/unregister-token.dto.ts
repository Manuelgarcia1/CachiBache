import { IsString, IsNotEmpty } from 'class-validator';

export class UnregisterTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
