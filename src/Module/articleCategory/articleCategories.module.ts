import { Module } from '@nestjs/common';
import { ArticleCategoriesService } from './articleCategories.service';
import { ArticleCategoriesProvider } from './articleCategories.providers';
import { ArticleCategoriesController } from './articleCategories.controller';

@Module({
  controllers: [ArticleCategoriesController],
  providers: [ArticleCategoriesService, ...ArticleCategoriesProvider],
})
export class ArticleCategoryModule {}
