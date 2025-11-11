import { IsString, IsNotEmpty, Matches, IsOptional, IsIn } from 'class-validator';

export class RegisterTokenDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^ExponentPushToken\[[a-zA-Z0-9_-]+\]$/, {
    message: 'Token must be a valid Expo push token format',
  })
  token: string;

  @IsOptional()
  @IsString()
  @IsIn(['ios', 'android'])
  deviceType?: string;
}
