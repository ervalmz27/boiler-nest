import { PRODUCTCATEGORY_PROVIDER } from '@/Helpers/contants';
import { ProductCategory } from './entities/productCategory.entity';

export const ProductCategoriesProvider = [
  {
    provide: PRODUCTCATEGORY_PROVIDER,
    useValue: ProductCategory,
  },
];
