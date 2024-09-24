import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class forgotPasswordDto{
    @IsEmail()
    email: string;

}