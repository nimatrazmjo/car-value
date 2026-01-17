import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUserIntercepter } from './interceptors/current-user.intercepter';

describe('UsersController', () => {
  let controller: UsersController;
  let users: User[];

  beforeEach(async () => {
    users = [];

    const fakeUserService: Partial<UsersService> = {
      findOne: (id: number) => {
        const user = users.find((u) => u.id === id);
        return Promise.resolve(user);
      },
      findAll: () => {
        return Promise.resolve(users);
      },
      update: (id: number, attrs: Partial<User>) => {
        const user = users.find((u) => u.id === id);
        if (!user) {
          return Promise.resolve(null);
        }
        Object.assign(user, attrs);
        return Promise.resolve(user);
      },
      remove: (id: number) => {
        const user = users.find((u) => u.id === id);
        if (!user) {
          return Promise.resolve(null);
        }
        users = users.filter((u) => u.id !== id);
        return Promise.resolve(user);
      },
    };

    const fakeAuthService: Partial<AuthService> = {
      signUp: (email: string, password: string) => {
        const user = { id: users.length + 1, email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      signIn: (email: string, password: string) => {
        let user = users.find((u) => u.email === email);
        if (!user) {
          user = { id: users.length + 1, email, password } as User;
          users.push(user);
        }
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          // no-op interceptor so @UseInterceptors works
          provide: CurrentUserIntercepter,
          useValue: {
            intercept: (_context: any, next: any) => next.handle(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sets and gets color in session', () => {
    const session: any = {};
    controller.createColor('red', session);

    expect(session.color).toBe('red');
    expect(controller.getColors(session)).toBe('red');
  });

  it('creates a user on signup and stores user id in session', async () => {
    const session: any = {};
    const user = await controller.createUser(
      { email: 'test@test.com', password: '123' },
      session,
    );

    expect(user.id).toBeDefined();
    expect(session.userId).toEqual(user.id);
  });

  it('logs in user and stores user id in session', async () => {
    const session: any = {};
    const user = await controller.signIn(
      { email: 'test@test.com', password: '123' },
      session,
    );

    expect(user!.id).toBeDefined();
    expect(session.userId).toEqual(user!.id);
  });

  it('whoAmI returns the current user', () => {
    const currentUser = { id: 1, email: 'me@test.com' } as any;
    const result = controller.whoAmI(currentUser);
    expect(result).toBe(currentUser);
  });

  it('logout clears session and returns message', () => {
    const session: any = { userId: 1 };
    const msg = controller.logout(session);

    expect(session.userId).toBeNull();
    expect(msg).toBe('You are logged out');
  });

  it('findUser returns a user when it exists', async () => {
    const existingUser = {
      id: 1,
      email: 'a@test.com',
      password: '123',
    } as User;
    users.push(existingUser);

    const user = await controller.findUser(1 as any);

    expect(user).toEqual(existingUser);
  });

  it('findUser throws NotFoundException when user does not exist', async () => {
    await expect(controller.findUser(999 as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findAllUsers returns all users', async () => {
    users.push(
      { id: 1, email: 'a@test.com', password: '111' } as User,
      { id: 2, email: 'b@test.com', password: '222' } as User,
    );

    const result = await controller.findAllUsers();

    expect(result.length).toBe(2);
    expect(result).toEqual(users);
  });

  it('updateUser updates an existing user', async () => {
    users.push({
      id: 1,
      email: 'old@test.com',
      password: '123',
    } as User);

    const updated = await controller.updateUser('1', {
      email: 'new@test.com',
      password: '23123',
    });

    expect(updated.email).toBe('new@test.com');
  });

  it('removeUser removes an existing user', async () => {
    users.push({
      id: 1,
      email: 'a@test.com',
      password: '123',
    } as User);
    expect(users.length).toBe(1);

    const removed = await controller.removeUser('1');

    expect(removed.id).toBe(1);
    expect(users.length).toBe(0);
  });
});
