import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsProvider } from './events.providers';
import { EventsController } from './events.controller';
import { EventTimeslotsService } from './eventTimeslots.service';
import { EventTicketsService } from './eventTickets.service';
import { EventFormService } from './eventForm.service';
import { TransactionEventService } from '../transaction/transactionEvent.service';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    EventTimeslotsService,
    EventTicketsService,
    EventFormService,
    TransactionEventService,
    ...EventsProvider,
  ],
})
export class EventsModule {}
