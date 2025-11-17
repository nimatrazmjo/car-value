import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { AuthService } from 'src/users/auth.service';
import { CurrentUserIntercepter } from 'src/users/interceptors/current-user.intercepter';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, CurrentUserIntercepter],
})
export class UsersModule {}
