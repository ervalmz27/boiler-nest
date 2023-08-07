import { PAYMENT_PROVIDER } from '@/Helpers/contants';
import { Payment } from './entities/payment.entity';

export const PaymentsProvider = [
  {
    provide: PAYMENT_PROVIDER,
    useValue: Payment,
  },
];
