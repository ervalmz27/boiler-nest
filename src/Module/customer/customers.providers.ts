import {
  COUPON_PROVIDER,
  MEMBERCOUPON_PROVIDER,
  MEMBERTIER_PROVIDER,
  CUSTOMER_PROVIDER,
  TRANSACTION_PROVIDER,
  CUSTOMER_BANK_PROVIDER,
} from '@/Helpers/contants';
import { Customer } from './entities/customer.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { CustomerBank } from './entities/customerBank entity';

export const CustomersProvider = [
  {
    provide: CUSTOMER_PROVIDER,
    useValue: Customer,
  },
  {
    provide: CUSTOMER_BANK_PROVIDER,
    useValue: CustomerBank,
  },
  {
    provide: TRANSACTION_PROVIDER,
    useValue: Transaction,
  },
];
