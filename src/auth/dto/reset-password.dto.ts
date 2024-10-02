import { IsString, Matches, MinLength, matches } from 'class-validator';

export class resetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'password should contain at least one number',
  })
  newPassword: string;
}
