import { NEWS_PROVIDER } from '@/Helpers/contants';
import { News } from './entities/news.entity';

export const NewsProvider = [
  {
    provide: NEWS_PROVIDER,
    useValue: News,
  },
];
