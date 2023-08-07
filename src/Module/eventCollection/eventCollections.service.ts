import { Inject, Injectable } from '@nestjs/common';
import { EVENT_COLLECTION_PROVIDER } from '@/Helpers/contants';
import { EventCollection } from './entities/eventCollection.entity';
import { CreateEventCollectionDto } from './dto/create-eventCollection.dto';
import { UpdateEventCollectionDto } from './dto/update-eventCollection.dto';
import { Op } from 'sequelize';

@Injectable()
export class EventCollectionsService {
  constructor(
    @Inject(EVENT_COLLECTION_PROVIDER)
    private readonly repository: typeof EventCollection,
  ) {}

  async findAll(): Promise<EventCollection[]> {
    return await this.repository.findAll<EventCollection>({
      include: {
        all: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: { id },
      include: { all: true },
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: any) {
    return await this.repository.create<EventCollection>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateEventCollectionDto) {
    return await this.repository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async setAsDefault(id: number) {
    return await this.repository.update(
      { is_default: 0 },
      {
        where: {
          id: {
            [Op.not]: id,
          },
        },
      },
    );
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }
}
