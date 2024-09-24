import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class signInDto{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, {message : 'password should contain atleast one number'})
    password: string;
}