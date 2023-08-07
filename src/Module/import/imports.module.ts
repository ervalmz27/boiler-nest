import { Module } from '@nestjs/common';
import { ImportService } from './imports.service';
import { ImportProviders } from './imports.providers';
import { ImportController } from './imports.controller';
import { ProductsService } from '../product/products.service';
import { ProductCategoriesService } from '../productCategory/productCategories.service';
import { ProductOptionsService } from '../product/productOptions.service';

@Module({
  controllers: [ImportController],
  providers: [
    ImportService,
    ProductsService,
    ProductCategoriesService,
    ProductOptionsService,
    ...ImportProviders,
  ],
})
export class ImportModule {}
