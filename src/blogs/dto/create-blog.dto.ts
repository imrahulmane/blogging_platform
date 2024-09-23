import { IsNumber, IsString } from "class-validator";

export class CreateBlogDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsNumber()
    user_id: number
}
