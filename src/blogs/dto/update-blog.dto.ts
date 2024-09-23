import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsBoolean, IsString, isBoolean } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsBoolean()
    isPublished: boolean
}
