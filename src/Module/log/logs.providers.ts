import { LOG_CUSTOMER_PROVIDER } from '@/Helpers/contants';
import { LogCustomer } from './entities/customerLog.entity';

export const LogsProvider = [
  {
    provide: LOG_CUSTOMER_PROVIDER,
    useValue: LogCustomer,
  },
];
