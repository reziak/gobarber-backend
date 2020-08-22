import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('it should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    const response = await authenticateUser.execute({
      email: 'belira@email.com',
      password: 'dont4get',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('it should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'belira@email.com',
        password: 'dont4get',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    await expect(
      authenticateUser.execute({
        email: 'belira@email.com',
        password: 'dont5get',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
