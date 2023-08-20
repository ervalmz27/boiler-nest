import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsProvider } from './notifications.providers';
import { NotificationsController } from './notifications.controller';
import { LogNotificationsService } from './logNotifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    LogNotificationsService,
    ...NotificationsProvider,
  ],
})
export class NotificationsModule {}
