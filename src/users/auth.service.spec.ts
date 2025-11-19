import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { find } from 'rxjs';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Auth Service', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {
    // Create fake copy of the users service
    fakeUserService = {
      findByEmail: (email: string) => Promise.resolve({} as User),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Create a new user with a salted and hashed password', async () => {
    const user = await service.signUp('nimat1.razmjo@example.com', 'asdf123');

    expect(user.password).not.toEqual('asdf123');

    const [salt, hash] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });

  it('Throws an error if user signs up with email that is in use', async () => {
    fakeUserService.findByEmail = () =>
      Promise.resolve({
        id: 1,
        email: 'nimat.razmjo@example.com',
        password: 'asd.asd',
      } as User);

    await expect(
      service.signUp('nimat.razmjo@example.com', 'asd'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Throws an error if user sings in with unregistered email', async () => {
    await expect(
      service.signIn('assd@example.com', 'tets.test'),
    ).rejects.toThrow(NotFoundException);
  });

  it(' Throws if an invalid password provided', async () => {
    fakeUserService.findByEmail = () =>
      Promise.resolve({
        email: 'nimat.razmjo@example.com',
        password: 'tastas.stata',
      } as User);

    await expect(
      service.signIn('nimat.razmjo@example.com', 'tastas.stata'),
    ).rejects.toThrow(BadRequestException);
  });

  it('return user with valid username and password provided', async () => {
    fakeUserService.findByEmail = () =>
      Promise.resolve({
        email: 'nimat.razmjo@example.com',
        password:
          'a6cafa083b958fe7.f0949ab49e8bfe5958fd65b62eeb3ee6d57857af9764e7355ccc3c489e56b57d',
      } as User);

    const user = await service.signIn('nimat.razmjo@example.com', 'test123');
    expect(user?.email).toBeDefined();
  });
});
