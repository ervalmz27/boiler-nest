import {
  COUPON_PROVIDER,
  MEMBERCOUPON_PROVIDER,
  MEMBERTIER_PROVIDER,
  MEMBER_PROVIDER,
  TRANSACTION_PROVIDER,
} from '@/Helpers/contants';
import { Customer } from './entities/customer.entity';
import { Transaction } from '../transaction/entities/transaction.entity';

export const CustomersProvider = [
  {
    provide: MEMBER_PROVIDER,
    useValue: Customer,
  },
  {
    provide: TRANSACTION_PROVIDER,
    useValue: Transaction,
  },
];
