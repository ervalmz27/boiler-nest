import {
  EVENT_COLLECTION_PROVIDER,
  EVENT_ITEM_PROVIDER,
  EVENT_PROVIDER,
} from '@/Helpers/contants';
import { EventCollection } from './entities/eventCollection.entity';
import { EventCollectionItem } from './entities/eventCollectionItem.entity';
import { Event } from '../event/entities/event.entity';

export const EventCollectionsProvider = [
  {
    provide: EVENT_COLLECTION_PROVIDER,
    useValue: EventCollection,
  },
  {
    provide: EVENT_ITEM_PROVIDER,
    useValue: EventCollectionItem,
  },
  {
    provide: EVENT_PROVIDER,
    useValue: Event,
  },
];
