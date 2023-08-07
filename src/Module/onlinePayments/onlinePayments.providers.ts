import {
  NOTIFICATION_PROVIDER,
  ONLINEPAYMENT_PROVIDER,
  TRANSACTION_PROVIDER,
} from '@/Helpers/contants';
import { OnlinePayment } from './entities/onlinePayment.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { LogNotification } from '../notifications/entities/logNotification.entity';

export const OnlinePaymentsProvider = [
  {
    provide: ONLINEPAYMENT_PROVIDER,
    useValue: OnlinePayment,
  },
  {
    provide: ONLINEPAYMENT_PROVIDER,
    useValue: OnlinePayment,
  },
  {
    provide: NOTIFICATION_PROVIDER,
    useValue: LogNotification,
  },
  {
    provide: TRANSACTION_PROVIDER,
    useValue: Transaction,
  },
];
