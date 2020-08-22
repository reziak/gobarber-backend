import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ userId }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${userId}`,
    );

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: userId,
      });
    }

    if (!users || users.length === 0) throw new AppError('Providers not found');

    await this.cacheProvider.save(`providers-list:${userId}`, users);

    return users;
  }
}

export default ListProvidersService;
