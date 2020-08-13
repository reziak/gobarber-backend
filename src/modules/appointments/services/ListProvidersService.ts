import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@module/users/repositories/IUsersRepository';

import User from '@module/users/infra/typeorm/entities/User';

interface IRequest {
  userId: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IRequest): Promise<User[]> {
    const users = await this.usersRepository.findAllProviders({
      except_user_id: userId,
    });

    if (!users || users.length === 0) throw new AppError('Providers not found');

    return users;
  }
}

export default ListProvidersService;
