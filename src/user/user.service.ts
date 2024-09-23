import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity as User, UserEntity } from './user.entity';
import { UserDto } from './dto/user-dto';
import { UserUpdateDto } from './dto/user-update-dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

    async create(userDto: UserDto): Promise<User>{
        const  result= await this.userRepository.save(this.userRepository.create(userDto));
        return result;
    }

    async findByEmail(email:  string, projection: (keyof UserEntity)[]=[]):  Promise<User|null>{
      return await this.userRepository.findOne({
          where:{email}, 
          select: projection.length > 0 ? projection : undefined
        })
    }

    async findAll(): Promise<UserEntity[]>{
      return await this.userRepository.find();
    }
    
    async findById(id: number, projection: (keyof UserEntity)[]=[]): Promise<User|null>{
      return await this.userRepository.findOne({
        where:{id: id},
        select: projection.length > 0 ? projection : undefined});
    }

    async update(id: number, userDto: UserUpdateDto): Promise<User|null>{
      await this.userRepository.update(id, userDto);
      return this.findById(id);
    }

    async findOne(filters: Object, projection:(keyof UserEntity)[]=[]): Promise<User|null>{
      return await this.userRepository.findOne({
        where : filters,
        select: projection.length > 0 ? projection : undefined
      })
    }

    async updatePassword(id: number, password: string): Promise<User|null>{
      await this.userRepository.update(id, {password});
      return this.findById(id);
    }

}
