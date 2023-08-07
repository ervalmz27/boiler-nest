import {
  PRODUCT_COLLECTION_ITEM_PROVIDER,
  PRODUCT_COLLECTION_PROVIDER,
  PRODUCT_PROVIDER,
} from '@/Helpers/contants';
import { ProductCollection } from './entities/productCollection.entity';
import { ProductCollectionItem } from './entities/productCollectionItem.entity';
import { Product } from '../product/entities/product.entity';

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
];
