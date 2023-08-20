import {
  NOTIFICATION_PROVIDER,
  LOG_NOTIFICATION_PROVIDER,
  MESSAGE_DETAIL_PROVIDER,
} from '@/Helpers/contants';
import { LogNotification } from './entities/logNotification.entity';
import { Notifications } from './entities/notifications.entity';

export const NotificationsProvider = [
  {
    provide: NOTIFICATION_PROVIDER,
    useValue: Notifications,
  },
  {
    provide: LOG_NOTIFICATION_PROVIDER,
    useValue: LogNotification,
  },
];
