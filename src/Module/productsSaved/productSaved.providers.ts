import { MEMBER_PROVIDER, PRODUCT_SAVED_PROVIDER } from '@/Helpers/contants';
import { ProductSaved } from './entities/productSaved.entity';
import { Member } from '../member/entities/member.entity';

export const ProductSavedProvider = [
  {
    provide: PRODUCT_SAVED_PROVIDER,
    useValue: ProductSaved,
  },
  {
    provide: MEMBER_PROVIDER,
    useValue: Member,
  },
];
