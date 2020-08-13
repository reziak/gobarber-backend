import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    const shownUser = await showProfile.execute({
      userId: user.id,
    });

    expect(shownUser.name).toBe('Belira');
    expect(shownUser.email).toBe('belira@email.com');
  });

  it('should not be able to show profile', async () => {
    await expect(
      showProfile.execute({
        userId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
