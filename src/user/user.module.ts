import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
