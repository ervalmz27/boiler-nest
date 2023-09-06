import {
  FEED_REPOSITORY,
  PRODUCTCATEGORY_PROVIDER,
  PRODUCT_OPTION_PROVIDER,
  PRODUCT_PROVIDER,
  TRANSACTION_PRODUCT_DETAIL_PROVIDER,
} from '@/Helpers/contants';
import { Product } from '../product/entities/product.entity';
import { ProductCategory } from '../productCategory/entities/productCategory.entity';
import { ProductOption } from '../product/entities/productOption.entity';
import { TransactionDetail } from '../transaction/entities/transactionProductDetail.entity';

export const ImportProviders = [
  {
    provide: PRODUCT_PROVIDER,
    useValue: Product,
  },
  {
    provide: PRODUCT_OPTION_PROVIDER,
    useValue: ProductOption,
  },
  {
    provide: PRODUCTCATEGORY_PROVIDER,
    useValue: ProductCategory,
  },
  {
    provide: TRANSACTION_PRODUCT_DETAIL_PROVIDER,
    useValue: TransactionDetail,
  },
];
