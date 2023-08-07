import { Op } from 'sequelize';
import * as moment from 'moment-timezone';

import { Inject, Injectable } from '@nestjs/common';
import { EVENT_PROVIDER } from '@/Helpers/contants';
import { Event } from './entities/event.entity';
import { EventTimeslot } from './entities/eventTimeslot.entity';

@Injectable()
export class EventsService {
  private timezone: string;

  constructor(
    @Inject(EVENT_PROVIDER)
    private readonly repository: typeof Event,
  ) {
    this.timezone = 'Asia/Hong_Kong';
  }

  async findAll(payload): Promise<Event[]> {
    const { is_published, q, status } = payload;

    const filterCondition = {};

    if (q && q !== '') {
      filterCondition['name'] = { [Op.like]: `%${q}%` };
    }

    if (is_published && is_published !== '') {
      filterCondition['is_published'] = is_published;
    }

    if (status && status !== '') {
      filterCondition['status'] = status;
    }

    return await this.repository.findAll<Event>({
      where: filterCondition,
      include: {
        all: true,
      },
    });
  }

  async findPast(payload: any) {
    const currentDate = moment().tz(this.timezone).format();
    return await this.repository.findAll({
      include: [
        {
          model: EventTimeslot,
          where: {
            start_date: {
              [Op.lte]: currentDate,
            },
          },
        },
      ],
    });
  }

  async findUpcoming(payload: any) {
    const currentDate = moment().tz(this.timezone).format();
    return await this.repository.findAll({
      include: [
        {
          model: EventTimeslot,
          where: {
            start_date: {
              [Op.gt]: currentDate,
            },
          },
        },
      ],
    });
  }

  async findByArrayId(arrayId) {
    return await this.repository.findAll({
      where: {
        id: arrayId,
      },
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      include: {
        all: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: any) {
    return await this.repository.create<Event>({ ...payload });
  }

  async update(id: number, payload: any) {
    return await this.repository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }

  async getAllHashtags() {
    return this.repository.findAll({
      attributes: ['hashtags'],
      raw: true,
    });
  }
}
