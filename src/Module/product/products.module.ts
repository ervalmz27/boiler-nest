import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsProvider } from './products.providers';
import { ProductsController } from './products.controller';
import { ProductOptionsService } from './productOptions.service';
import { ProductMediasService } from './productMedias.service';
import { ProductCategoriesService } from '../productCategory/productCategories.service';
import { ProductTagService } from '../productTag/productTag.service';
import { ProductWishlistService } from './services/productWishlist.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductOptionsService,
    ProductMediasService,
    ProductCategoriesService,
    ProductTagService,
    ProductWishlistService,
    ...ProductsProvider,
  ],
})
export class ProductsModule {}
