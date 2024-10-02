// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update-dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getUser(@Param('id') id: number) {
    return await this.userService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: UserUpdateDto) {
    return await this.userService.update(id, body);
  }
}
