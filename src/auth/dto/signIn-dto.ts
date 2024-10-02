import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class signInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'password should contain at least one number',
  })
  password: string;
}
