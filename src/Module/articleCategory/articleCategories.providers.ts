import { ARTICLECATEGORY_PROVIDER } from '@/Helpers/contants';
import { ArticleCategory } from './entities/articleCategory.entity';

export const ArticleCategoriesProvider = [
  {
    provide: ARTICLECATEGORY_PROVIDER,
    useValue: ArticleCategory,
  },
];
