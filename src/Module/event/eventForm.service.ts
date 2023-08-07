import { Inject, Injectable } from '@nestjs/common';
import { EVENT_FORM_REPOSITORY } from '@/Helpers/contants';
import { EventTimeslot } from './entities/eventTimeslot.entity';
import { Op } from 'sequelize';
import * as moment from 'moment';
import { EventForm } from './entities/eventForm.entity';

@Injectable()
export class EventFormService {
  private timezone: string;

  constructor(
    @Inject(EVENT_FORM_REPOSITORY)
    private readonly repository: typeof EventForm,
  ) {
    this.timezone = 'Asia/Hong_Kong';
  }

  async findByEvent(event_id) {
    return this.repository.findAll({
      where: {
        event_id,
      },
    });
  }

  async findById(id) {
    return this.repository.findOne({
      where: { id },
      raw: true,
    });
  }

  async create(payload) {
    return this.repository.create(payload);
  }

  async update(id, payload) {
    return this.repository.update(payload, {
      where: { id },
    });
  }
  async remove({ id, form_id }) {
    return this.repository.destroy({
      where: {
        event_id: id,
        id: form_id,
      },
      force: true,
    });
  }
}
