import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_EVENT_PROVIDER } from '@/Helpers/contants';
import { TransactionEvent } from './entities/transactionEvent.entity';

@Injectable()
export class TransactionEventService {
  constructor(
    @Inject(TRANSACTION_EVENT_PROVIDER)
    private readonly repository: typeof TransactionEvent,
  ) {}

  async calculateTotalCost(items) {
    let total = 0;
    const eventDetails = [];

    for (const e of items) {
      if (e.item_type === 'EVENT') {
        total += e.qty * e.price;
        eventDetails.push(e);
      }
    }

    return {
      total,
      detail: eventDetails,
    };
  }

  async create(trxId, items) {
    items.map((e) => {
      e['transaction_id'] = trxId;
      e['participants_data'] = JSON.stringify(e.participants);
      e['subtotal'] = e.qty * e.price;
      delete e['participants'];
      return e;
    });
    return this.repository.bulkCreate(items);
  }

  async getEventParticipants(event_id) {
    return this.repository.findAll({
      where: { event_id },
      include: {
        all: true,
      },
      order: [['created_at', 'desc']],
    });
  }

  async getTotalParticipantByEvent(event_id) {
    const data = await this.repository.findAll({
      where: {
        event_id: event_id,
      },
      attributes: ['participants_data'],
      raw: true,
    });

    let ret = 0;
    for (const d of data) {
      try {
        const party = JSON.parse(d.participants_data);
        ret += party.length;
      } catch (error) {
        console.error(error.message);
      }
    }
    return ret;
  }
}
