import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class UserUpdateDto{
    @IsOptional()
    @IsString()
    username:  string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, {message : 'password should contain atleast one number'})
    password: string;
}