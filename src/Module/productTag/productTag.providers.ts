import { PRODUCTTAG_PROVIDER } from '@/Helpers/contants';
import { ProductTag } from './entities/productTag.entity';

export const ProductTagProvider = [
  {
    provide: PRODUCTTAG_PROVIDER,
    useValue: ProductTag,
  },
];
