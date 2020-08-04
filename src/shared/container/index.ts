import { container } from 'tsyringe';

import '@module/users/providers';
import './providers';

import IAppointmentsRepository from '@module/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@module/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@module/users/repositories/IUsersRepository';
import UsersRepository from '@module/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@module/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@module/users/infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);
