import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { UpdateUserDTO } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {

    constructor(private user: UsersService){}
    @Post('signup')
    createUser(@Body() body: CreateUserDTO) {
        const {email, password} = body
        return this.user.create(email, password)
    }

    @Get(':id')
    async findUser(@Param('id') id: number) {
        const user = await this.user.findOne(id)

        if (!user) {
            throw new NotFoundException('User not FOund')
        }
        return user
    }

    @Get('')
    findAllUsers(
    ) {
        return this.user.findAll()
    }

    @Patch(':id')
    updateUser(
        @Param('id') id: string,
        @Body() body: UpdateUserDTO
    ) {
        return this.user.update(+id, body)
    }

    @Delete(':id')
    removeUser(@Param('id') id: string) {
        return this.user.remove(+id)
    }
}
