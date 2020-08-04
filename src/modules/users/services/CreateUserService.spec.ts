import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create users with same emails', async () => {
    await createUser.execute({
      name: 'belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    await expect(
      createUser.execute({
        name: 'belira',
        email: 'belira@email.com',
        password: 'dont4get',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
