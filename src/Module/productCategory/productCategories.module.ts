import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './productCategories.service';
import { ProductCategoriesProvider } from './productCategories.providers';
import { ProductCategoriesController } from './productCategories.controller';

@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService, ...ProductCategoriesProvider],
})
export class ProductCategoryModule {}
