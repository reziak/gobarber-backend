import { ObjectID } from 'mongodb';

import INotificationsRepository from '@module/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@module/notifications/dtos/ICreateNotificationDTO';

import Notification from '@module/notifications/infra/typeorm/schemas/Notification';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
