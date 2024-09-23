import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>
  ){}

  async create(createBlogDto: CreateBlogDto) {
    return await this.blogRepository.save(createBlogDto);
  }

  async findAll() {
    return await this.blogRepository.find();
  }

  async findOne(id: number) {
    return await this.blogRepository.findOne({where : {id}});
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    await this.blogRepository.update(id, updateBlogDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.blogRepository.delete(id);
  }

  async findAllBlogsOfParticularUser(user_id: number){
    return await this.blogRepository.findAndCount({where : {user_id : user_id}});
  }
}
