import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@module/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Maremilia',
      email: 'lia@email.com',
      password: 'dont4get',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Lily',
      email: 'nat@email.com',
      password: 'dont4get',
    });

    const providers = await listProviders.execute({
      userId: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });

  it('should not be able to show profile', async () => {
    await expect(
      listProviders.execute({
        userId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
