import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@module/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 20, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 7, 20, 14),
      provider_id: '123456789',
      user_id: '987654321',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456789');
  });

  it('should not be able to create appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 20, 12).getTime();
    });

    await createAppointment.execute({
      date: new Date(2020, 7, 20, 14),
      provider_id: '123456789',
      user_id: '987654321',
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 20, 14),
        provider_id: '123456789',
        user_id: '987654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 20, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 19, 12),
        provider_id: '123456789',
        user_id: '987654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with user being the provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 20, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 20, 14),
        provider_id: '123456789',
        user_id: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside regular hours(8h~18h)', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 20, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 21, 7),
        provider_id: '123456789',
        user_id: '987654321',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 21, 18),
        provider_id: '123456789',
        user_id: '987654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
