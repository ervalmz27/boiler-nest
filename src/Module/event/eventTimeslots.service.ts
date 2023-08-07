import { Inject, Injectable } from '@nestjs/common';
import { EVENT_TIMESLOT_REPOSITORY } from '@/Helpers/contants';
import { EventTimeslot } from './entities/eventTimeslot.entity';
import { Op } from 'sequelize';
import * as moment from 'moment';

@Injectable()
export class EventTimeslotsService {
  private timezone: string;

  constructor(
    @Inject(EVENT_TIMESLOT_REPOSITORY)
    private readonly repository: typeof EventTimeslot,
  ) {
    this.timezone = 'Asia/Hong_Kong';
  }

  async findPastEvent() {
    const currentDate = moment().tz(this.timezone).format();
    return await this.repository.findAll({
      where: {
        end_date: {
          [Op.lte]: currentDate,
        },
      },
    });
  }

  async findUpcomingEvent() {
    const currentDate = moment().tz(this.timezone).format();
    return await this.repository.findAll({
      where: {
        end_date: {
          [Op.gte]: currentDate,
        },
      },
    });
  }

  async findByEvent(id) {
    return await this.repository.findAll({
      where: {
        event_id: id,
      },
    });
  }

  async findTimeslotById(payload) {
    return await this.repository.findOne({
      where: {
        id: payload.timeslot_id,
        event_id: payload.event_id,
      },
    });
  }

  async addTimeslot(payload) {
    return await this.repository.create({
      event_id: payload.event_id,
      start_date: payload.start_date,
      end_date: payload.end_date,
      total_ticket: payload.total_ticket,
      total_participant: payload.total_participant,
    });
  }

  async updateTimeslot(payload) {
    return await this.repository.update(
      {
        event_id: payload.event_id,
        start_date: payload.start_date,
        end_date: payload.end_date,
        total_ticket: payload.total_ticket,
        total_participant: payload.total_participant,
      },
      {
        where: {
          id: payload.timeslot_id,
        },
      },
    );
  }

  async deleteTimeslot(payload) {
    return await this.repository.destroy({
      where: {
        id: payload.timeslot_id,
        event_id: payload.event_id,
      },
      force: true,
    });
  }
}
