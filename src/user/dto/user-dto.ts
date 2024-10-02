import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'password should contain at least one number',
  })
  password: string;

  @IsEmail()
  email: string;
}
