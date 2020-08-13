import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderService from '@module/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const listProviders = container.resolve(ListProviderService);

    const providers = await listProviders.execute({ userId });

    return response.json(providers);
  }
}
