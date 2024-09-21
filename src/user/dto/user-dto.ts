import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDto{
    @IsString()
    username:  string;

    @IsNotEmpty()
    password:  string;

    @IsEmail()
    email: string;
}