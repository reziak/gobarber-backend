import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@module/users/services/UpdateProfileService';
import ShowProfileService from '@module/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    // show profile
    const userId = request.user.id;
    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ userId });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { name, email, old_password, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      userId,
      name,
      email,
      old_password,
      password,
    });

    return response.json(classToClass(user));
  }
}
