import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'Belira Lira',
      email: 'be.li.ra@email.com',
    });

    expect(updatedUser.name).toBe('Belira Lira');
    expect(updatedUser.email).toBe('be.li.ra@email.com');
  });

  it('should not be able to update profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        userId: 'non-existing-user-id',
        name: 'test',
        email: 'test@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update to another used email', async () => {
    await fakeUsersRepository.create({
      name: 'Belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    const user = await fakeUsersRepository.create({
      name: 'Malia',
      email: 'malia@email.com',
      password: 'dont4get',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'Malia Lia',
        email: 'belira@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'Belira Lira',
      email: 'be.li.ra@email.com',
      old_password: 'dont4get',
      password: 'dont5get',
    });

    expect(updatedUser.password).toBe('dont5get');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'Belira Lira',
        email: 'be.li.ra@email.com',
        password: 'dont5get',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'Belira Lira',
        email: 'be.li.ra@email.com',
        old_password: 'wrongoldpassword',
        password: 'dont5get',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
