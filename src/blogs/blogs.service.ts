import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { ErrorEnum } from '../utils/constants/error-constant-enum';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    return await this.blogRepository.save(createBlogDto);
  }

  async findAll() {
    return await this.blogRepository.find();
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException(ErrorEnum.REQUIRED_ID_MISSING);
    }

    return await this.blogRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    if (!id) {
      throw new BadRequestException(ErrorEnum.REQUIRED_ID_MISSING);
    }

    await this.blogRepository.update(id, updateBlogDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException(ErrorEnum.REQUIRED_ID_MISSING);
    }

    return this.blogRepository.delete(id);
  }

  async findAllBlogsOfParticularUser(user_id: number) {
    if (!user_id) {
      throw new BadRequestException(ErrorEnum.REQUIRED_ID_MISSING);
    }

    return await this.blogRepository.findAndCount({
      where: { user_id: user_id },
    });
  }

  async searchBlogs(searchTerm: string) {
    if (!searchTerm || searchTerm.length < 3) {
      throw new BadRequestException(
        'Search term must be at least 3 characters',
      );
    }

    return this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.title LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('blog.content LIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();
  }
}
