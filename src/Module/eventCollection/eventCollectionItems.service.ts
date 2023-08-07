import { Inject, Injectable } from '@nestjs/common';
import { EVENT_ITEM_PROVIDER } from '@/Helpers/contants';
import { EventCollectionItem } from './entities/eventCollectionItem.entity';

@Injectable()
export class EventCollectionItemService {
  constructor(
    @Inject(EVENT_ITEM_PROVIDER)
    private readonly repository: typeof EventCollectionItem,
  ) {}

  async bulkCreate(payload: any) {
    return this.repository.bulkCreate(payload);
  }

  async create(payload: any) {
    return this.repository.create(payload);
  }

  async findByCollection(id) {
    return this.repository.findAll({
      where: {
        event_collection_id: id,
      },
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at'],
      },
      order: [['created_at', 'desc']],
    });
  }

  async remove(id) {
    return this.repository.destroy({
      where: { id },
      force: true,
    });
  }

  async removeCond({ event_id, event_collection_id }) {
    return this.repository.destroy({
      where: {
        event_id,
        event_collection_id,
      },
      force: true,
    });
  }
}
