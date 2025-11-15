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
import { AuthService } from 'src/users/auth.service';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { LoginUserDTO } from 'src/users/dtos/login-user.dto';
import { UpdateUserDTO } from 'src/users/dtos/update-user.dto';
import { UserDTO } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private user: UsersService,
    private authService: AuthService,
  ) {}
  @Post('signup')
  @Serialize(UserDTO)
  createUser(@Body() body: CreateUserDTO) {
    const { email, password } = body;
    return this.authService.signUp(email, password);
  }

  @Post('login')
  @Serialize(UserDTO)
  signIn(@Body() body: LoginUserDTO) {
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }

  @Serialize(UserDTO)
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
  @Serialize(UserDTO)
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
