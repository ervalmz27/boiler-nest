import { Module } from '@nestjs/common';
import { EventCollectionsService } from './eventCollections.service';
import { EventCollectionsProvider } from './eventCollections.providers';
import { EventCollectionsController } from './eventCollections.controller';
import { EventCollectionItemService } from './eventCollectionItems.service';
import { EventsService } from '../event/events.service';

@Module({
  controllers: [EventCollectionsController],
  providers: [
    EventsService,
    EventCollectionsService,
    EventCollectionItemService,
    ...EventCollectionsProvider,
  ],
})
export class EventCollectionsModule {}
