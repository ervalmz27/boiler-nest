import { DISCOUNT_PROVIDER } from '@/Helpers/contants';
import { Discount } from './entities/discount.entity';

export const DiscountsProvider = [
  {
    provide: DISCOUNT_PROVIDER,
    useValue: Discount,
  },
];
