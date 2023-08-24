import { PRODUCT_TAG_PROVIDER } from '@/Helpers/contants';
import { ProductTag } from './entities/productTag.entity';

export const ProductTagProvider = [
  {
    provide: PRODUCT_TAG_PROVIDER,
    useValue: ProductTag,
  },
];
