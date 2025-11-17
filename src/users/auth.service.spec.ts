import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { find } from 'rxjs';
import { User } from './user.entity';

it('Can create an instance of auth service', async () => {
  // Create fake copy of the users service
  const fakeUserService: Partial<UsersService> = {
    findOne: (id: number) => Promise.resolve({} as User),
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

  const service = module.get(AuthService);

  expect(service).toBeDefined();
});
