import { Inject, Injectable } from '@nestjs/common';
import { EVENT_TICKET_PROVIDER } from '@/Helpers/contants';
import { EventTicket } from './entities/eventTicket.entity';

@Injectable()
export class EventTicketsService {
  constructor(
    @Inject(EVENT_TICKET_PROVIDER)
    private readonly repository: typeof EventTicket,
  ) {}

  async findByEvent(id) {
    return await this.repository.findAll({
      where: {
        event_id: id,
      },
    });
  }

  async findTicketById(payload) {
    return await this.repository.findOne({
      where: {
        id: payload.ticket_id,
        event_id: payload.event_id,
      },
    });
  }

  async addTicket(payload) {
    return await this.repository.create({
      event_id: payload.event_id,
      name: payload.name,
      price: payload.price,
      total_ticket: payload.total_ticket,
    });
  }

  async updateTicket(payload) {
    return await this.repository.update(
      {
        name: payload.name,
        total_ticket: payload.total_ticket,
        price: payload.price,
      },
      {
        where: {
          event_id: +payload.event_id,
          id: payload.ticket_id,
        },
      },
    );
  }

  async deleteTicket(payload) {
    return await this.repository.destroy({
      where: {
        event_id: payload.event_id,
        id: payload.ticket_id,
      },
      force: true,
    });
  }

  async calculateStock(payload) {
    const emptyTicket = [];
    for (const e of payload) {
      if (e.item_type === 'EVENT') {
        const ticket = await this.repository.findOne({
          where: {
            id: e.event_ticket_id,
          },
          raw: true,
        });

        if (ticket !== null) {
          if (ticket.total_ticket <= 0) {
            emptyTicket.push({
              event_id: e.event_id,
              event_timeslot_id: e.event_timeslot_id,
              event_ticket_id: e.event_ticket_id,
              qty_buy: e.qty,
              qty_stock: e.total_ticket,
            });
          } else {
            const remaining = ticket.total_ticket - e.qty;
            if (remaining < 1) {
              emptyTicket.push({
                event_id: e.event_id,
                event_timeslot_id: e.event_timeslot_id,
                event_ticket_id: e.event_ticket_id,
                qty_buy: e.qty,
                qty_stock: e.total_ticket,
              });
            }
          }
        } else {
          emptyTicket.push({
            event_id: e.event_id,
            event_timeslot_id: e.event_timeslot_id,
            event_ticket_id: e.event_ticket_id,
            qty_buy: e.qty,
            qty_stock: null,
          });
        }
      }
    }
    return emptyTicket;
  }
}
