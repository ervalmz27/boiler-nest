import { ARTICLE_PROVIDER } from '@/Helpers/contants';
import { Article } from './entities/article.entity';

export const ArticlesProvider = [
  {
    provide: ARTICLE_PROVIDER,
    useValue: Article,
  },
];
