import { IsEmail, IsString } from "class-validator";

export class UserUpdateDto{
    @IsString()
    username:  string;

    @IsEmail()
    email: string;
}