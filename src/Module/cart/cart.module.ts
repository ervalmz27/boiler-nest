import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartProvider } from './cart.providers';
import { CartController } from './cart.controller';
import { MembersService } from '../member/members.service';
import { ProductsService } from '../product/products.service';
import { ProductOptionsService } from '../product/productOptions.service';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    MembersService,
    ProductsService,
    ProductOptionsService,
    ...CartProvider,
  ],
})
export class CartModule {}
