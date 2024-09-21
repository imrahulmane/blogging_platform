import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity as User, UserEntity } from './user.entity';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

    async create(userDto: UserDto): Promise<User>{
        const  result= await this.userRepository.save(this.userRepository.create(userDto));
        return result;
    }

    async findByEmail(email:  string):  Promise<User|null>{
      return await this.userRepository.findOne({where:{email}})
    }

    async findAll(): Promise<UserEntity[]>{
      return await this.userRepository.find();
    }
    
    async findById(id: number): Promise<User|null>{
      return await this.userRepository.findOne({where:{id: id}});
    }
}
