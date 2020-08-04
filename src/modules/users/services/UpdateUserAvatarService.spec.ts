import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.png',
    });

    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update avatar for non-existing user', async () => {
    expect(
      updateUserAvatar.execute({
        userId: 'user-id',
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar and replace it with the new upload', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Belira',
      email: 'belira@email.com',
      password: 'dont4get',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.png',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar-1.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('avatar-1.png');
  });
});
