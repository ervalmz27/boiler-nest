import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsProvider } from './products.providers';
import { ProductsController } from './products.controller';
import { ProductOptionsService } from './productOptions.service';
import { ProductMediasService } from './productMedias.service';
import { ProductCategoriesService } from '../productCategory/productCategories.service';
import { ProductTagService } from '../productTag/productTag.service';
import { ProductWishlistService } from './services/productWishlist.service';
import SpaceFile from '@/Helpers/files';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductOptionsService,
    ProductMediasService,
    SpaceFile,
    ProductCategoriesService,
    ProductTagService,
    ProductWishlistService,
    ...ProductsProvider,
  ],
})
export class ProductsModule { }
