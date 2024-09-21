import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class signInDto{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}