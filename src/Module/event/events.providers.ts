import {
  EVENT_FORM_REPOSITORY,
  EVENT_PROVIDER,
  EVENT_TICKET_PROVIDER,
  EVENT_TIMESLOT_REPOSITORY,
  TRANSACTION_EVENT_PROVIDER,
} from '@/Helpers/contants';
import { Event } from './entities/event.entity';
import { EventTicket } from './entities/eventTicket.entity';
import { EventTimeslot } from './entities/eventTimeslot.entity';
import { EventForm } from './entities/eventForm.entity';
import { TransactionEvent } from '../transaction/entities/transactionEvent.entity';

export const EventsProvider = [
  {
    provide: EVENT_PROVIDER,
    useValue: Event,
  },
  {
    provide: EVENT_TICKET_PROVIDER,
    useValue: EventTicket,
  },
  {
    provide: EVENT_TIMESLOT_REPOSITORY,
    useValue: EventTimeslot,
  },

  {
    provide: EVENT_FORM_REPOSITORY,
    useValue: EventForm,
  },

  {
    provide: EVENT_TICKET_PROVIDER,
    useValue: EventTicket,
  },

  {
    provide: TRANSACTION_EVENT_PROVIDER,
    useValue: TransactionEvent,
  },
];
