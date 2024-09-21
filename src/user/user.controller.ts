import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guards';


@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService:  UserService){}

    @Get('/:id')
    async getUser(@Param("id") id: number){
        return await this.userService.findById(id);
    }
}
