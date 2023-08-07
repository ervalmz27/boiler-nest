import { EVENTCATEGORY_PROVIDER } from '@/Helpers/contants';
import { EventCategory } from './entities/eventCategory.entity';

export const EventCategorisProvider = [
  {
    provide: EVENTCATEGORY_PROVIDER,
    useValue: EventCategory,
  },
];
