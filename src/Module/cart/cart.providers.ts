import {
  CART_PROVIDER,
  MEMBER_PROVIDER,
  PRODUCT_OPTION_PROVIDER,
  PRODUCT_PROVIDER,
} from '@/Helpers/contants';
import { Cart } from './entities/cart.entity';
import { Member } from '../member/entities/member.entity';
import { Product } from '../product/entities/product.entity';
import { ProductOption } from '../product/entities/productOption.entity';

export const CartProvider = [
  {
    provide: CART_PROVIDER,
    useValue: Cart,
  },
  {
    provide: PRODUCT_PROVIDER,
    useValue: Product,
  },
  {
    provide: PRODUCT_OPTION_PROVIDER,
    useValue: ProductOption,
  },
  {
    provide: MEMBER_PROVIDER,
    useValue: Member,
  },
];
