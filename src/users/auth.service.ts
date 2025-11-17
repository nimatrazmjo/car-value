import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _script } from 'crypto';
import { UsersService } from './users.service';
import { promisify } from 'util';
const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string) {
    // check if the user exists
    const existUser = await this.userService.findByEmail(email);

    if (existUser) {
      throw new BadRequestException('User already exists');
    }
    // hash password
    const salt = randomBytes(8).toString('hex');

    const hash_password = (await scrypt(password, salt, 32)) as Buffer;

    const salted_password = salt + '.' + hash_password.toString('hex');
    // save to user table
    const user = this.userService.create(email, salted_password);
    // return with token
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User does not exists');
    }

    const [salt, salted_password] = user.password.split('.');
    const hashPassword = (await scrypt(password, salt, 32)) as Buffer;

    if (hashPassword.toString('hex') != salted_password) {
      throw new BadRequestException('Password does not match');
    }

    return user;
  }
}
