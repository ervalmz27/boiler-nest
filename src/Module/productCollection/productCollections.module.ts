import { Module } from '@nestjs/common';
import { ProductCollectionsService } from './productCollections.service';
import { ProductCollectionsProvider } from './productCollections.providers';
import { ProductCollectionsController } from './productCollections.controller';
import { ProductCollectionItemsService } from './productCollectionItems.service';
import { ProductsService } from '../product/products.service';

@Module({
  controllers: [ProductCollectionsController],
  providers: [
    ProductCollectionsService,
    ProductCollectionItemsService,
    ProductsService,
    ...ProductCollectionsProvider,
  ],
})
export class ProductCollectionsModule {}
