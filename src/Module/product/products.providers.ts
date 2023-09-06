import {
  NOTIFICATION_PROVIDER,
  PRODUCTCATEGORY_PROVIDER,
  PRODUCT_MEDIA_PROVIDER,
  PRODUCT_OPTION_PROVIDER,
  PRODUCT_PROVIDER,
  PRODUCT_TAG_PROVIDER,
  PRODUCT_WISHLIST_PROVIDER,
  TRANSACTION_PRODUCT_DETAIL_PROVIDER
} from '@/Helpers/contants';
import { Product } from './entities/product.entity';
import { ProductOption } from './entities/productOption.entity';
import { ProductMedia } from './entities/productMedia.entity';
import { LogNotification } from '../notifications/entities/logNotification.entity';
import { ProductCategory } from '../productCategory/entities/productCategory.entity';
import { ProductTag } from '../productTag/entities/productTag.entity';
import { ProductWishlist } from './entities/productWishlist.entity';
import { TransactionDetail } from '../transaction/entities/transactionProductDetail.entity';

export const ProductsProvider = [
  {
    provide: PRODUCT_PROVIDER,
    useValue: Product,
  },
  {
    provide: PRODUCT_TAG_PROVIDER,
    useValue: ProductTag,
  },
  {
    provide: PRODUCT_OPTION_PROVIDER,
    useValue: ProductOption,
  },
  {
    provide: PRODUCT_MEDIA_PROVIDER,
    useValue: ProductMedia,
  },
  {
    provide: NOTIFICATION_PROVIDER,
    useValue: LogNotification,
  },
  {
    provide: PRODUCTCATEGORY_PROVIDER,
    useValue: ProductCategory,
  },
  {
    provide: PRODUCT_WISHLIST_PROVIDER,
    useValue: ProductWishlist,
  },
  {
    provide: TRANSACTION_PRODUCT_DETAIL_PROVIDER,
    useValue: TransactionDetail,
  },
];
