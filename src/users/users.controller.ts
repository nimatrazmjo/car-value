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
  Session,
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

  @Get('color/:color')
  createColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('color')
  getColors(@Session() session: any) {
    return session.color;
  }

  @Post('signup')
  @Serialize(UserDTO)
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signUp(email, password);
    session.useId = await user.id;
    return user;
  }

  @Post('login')
  @Serialize(UserDTO)
  async signIn(@Body() body: LoginUserDTO, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signIn(email, password);
    session.userId = user.id;
    return user;
  }

  @Get('whoami')
  @Serialize(UserDTO)
  whoAmI(@Session() session: any) {
    return this.user.findOne(session?.userId);
  }

  @Get('logout')
  logout(@Session() session: any) {
    session.userId = null;
    return 'You are logged out';
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
