import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  InterceptorClass,
  Serialize,
} from 'src/intercepters/serialize.interceptor';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { UpdateUserDTO } from 'src/users/dtos/update-user.dto';
import { UserDTO } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/users.service';

@Serialize(UserDTO)
@Controller('users')
export class UsersController {
  constructor(private user: UsersService) {}
  @Post('signup')
  createUser(@Body() body: CreateUserDTO) {
    const { email, password } = body;
    return this.user.create(email, password);
  }

  @Get(':id')
  async findUser(@Param('id') id: number) {
    console.log('Inside controller');
    const user = await this.user.findOne(id);
    console.log('after find one');

    if (!user) {
      throw new NotFoundException('User not FOund');
    }
    return user;
  }

  @Get('')
  findAllUsers() {
    return this.user.findAll();
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.user.update(+id, body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.user.remove(+id);
  }
}
