import { Router } from 'express';
import appointmentsRouter from '@module/appointments/infra/http/routes/appointments.routes';
import providersRouter from '@module/appointments/infra/http/routes/providers.routes';
import usersRouter from '@module/users/infra/http/routes/users.routes';
import sessionsRouter from '@module/users/infra/http/routes/sessions.routes';
import passwordRouter from '@module/users/infra/http/routes/password.routes';
import profileRouter from '@module/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/providers', providersRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
