import { FEED_REPOSITORY } from '@/Helpers/contants';
import { Feeds } from './entities/feed.entity';

export const feedsProviders = [
  {
    provide: FEED_REPOSITORY,
    useValue: Feeds,
  },
];
