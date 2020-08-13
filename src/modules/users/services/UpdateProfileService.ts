import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  userId: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    userId,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new AppError('User not found');

    const isEmailUsed = await this.usersRepository.findByEmail(email);

    if (isEmailUsed && isEmailUsed.id !== userId)
      throw new AppError('Email already in use.');

    user.name = name;
    user.email = email;

    if (password && !old_password)
      throw new AppError('Must provide old password');

    if (password && old_password) {
      const oldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!oldPassword) throw new AppError('Old password dont match');

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
