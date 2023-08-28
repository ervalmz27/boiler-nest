import { CONTENT_PROVIDER } from '@/Helpers/contants';
import { Content } from './entities/content.entity';

export const ContentsProvider = [
  {
    provide: CONTENT_PROVIDER,
    useValue: Content,
  },
];
