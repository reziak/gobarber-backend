import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@module/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.body;

    const listDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listDayAvailability.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(availability);
  }
}
