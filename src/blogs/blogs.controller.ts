import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogsService.create(createBlogDto);
  }

  @Get()
  async findAll() {
    return await this.blogsService.findAll();
  }

  @Get('/search')
  async searchBlogs(@Query("term") term: string){
    return await this.blogsService.searchBlogs(term);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.blogsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogsService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.blogsService.remove(+id);
  }

  @Get('/user/:id')
  async getBlogsOfParticularUser(@Param("id") user_id: number){
    return await this.blogsService.findAllBlogsOfParticularUser(user_id);
  }
}
