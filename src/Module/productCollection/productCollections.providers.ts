import {
  PRODUCT_COLLECTION_ITEM_PROVIDER,
  PRODUCT_COLLECTION_PROVIDER,
  PRODUCT_PROVIDER,
  PRODUCT_TAG_PROVIDER,
  PRODUCT_WISHLIST_PROVIDER,
  PRODUCTCATEGORY_PROVIDER,
  TRANSACTION_PRODUCT_DETAIL_PROVIDER
} from '@/Helpers/contants';
import { ProductCollection } from './entities/productCollection.entity';
import { ProductCollectionItem } from './entities/productCollectionItem.entity';
import { Product } from '../product/entities/product.entity';
import { ProductTag } from '../productTag/entities/productTag.entity';
import { ProductWishlist } from '../product/entities/productWishlist.entity';
import { ProductCategory } from '../productCategory/entities/productCategory.entity';
import { TransactionDetail } from '../transaction/entities/transactionProductDetail.entity';

export const ProductCollectionsProvider = [
  {
    provide: PRODUCT_COLLECTION_PROVIDER,
    useValue: ProductCollection,
  },
  {
    provide: PRODUCT_COLLECTION_ITEM_PROVIDER,
    useValue: ProductCollectionItem,
  },
  {
    provide: PRODUCT_PROVIDER,
    useValue: Product,
  },
  {
    provide: PRODUCT_TAG_PROVIDER,
    useValue: ProductTag,
  },
  {
    provide: PRODUCT_WISHLIST_PROVIDER,
    useValue: ProductWishlist,
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
