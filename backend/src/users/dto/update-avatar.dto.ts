import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateAvatarDto {
  @IsString()
  @IsNotEmpty()
  avatarUrl: string;
}