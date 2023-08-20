import {
  COUPON_PROVIDER,
  MEMBERCOUPON_PROVIDER,
  MEMBERTIER_PROVIDER,
  MEMBER_PROVIDER,
  NOTIFICATION_PROVIDER,
} from '@/Helpers/contants';
import { Customer } from './entities/customer.entity';
import { LogNotification } from '../notifications/entities/logNotification.entity';

export const CustomersProvider = [
  {
    provide: MEMBER_PROVIDER,
    useValue: Customer,
  },
  {
    provide: NOTIFICATION_PROVIDER,
    useValue: LogNotification,
  },
];
