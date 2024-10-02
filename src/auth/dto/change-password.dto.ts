import { IsString, Matches, MinLength } from 'class-validator';

export class changePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'password should contain atleast one number',
  })
  newPassword: string;
}
