import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsProvider } from './notifications.providers';
import { NotificationsController } from './notifications.controller';
import { LogNotificationsService } from './logNotifications.service';
import { MessageDetailsService } from '../messages/messageDetails.service';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    LogNotificationsService,
    MessageDetailsService,
    ...NotificationsProvider,
  ],
})
export class NotificationsModule {}
