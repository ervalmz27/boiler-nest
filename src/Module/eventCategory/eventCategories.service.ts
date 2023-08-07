import { Inject, Injectable } from '@nestjs/common';
import { EVENTCATEGORY_PROVIDER } from '@/Helpers/contants';
import { EventCategory } from './entities/eventCategory.entity';
import { CreateEventCategoryDto } from './dto/create-eventCategory.dto';
import { UpdateEventCategoryDto } from './dto/update-eventCategory.dto';
import { Op } from 'sequelize';

@Injectable()
export class EventCategoriesService {
  constructor(
    @Inject(EVENTCATEGORY_PROVIDER)
    private readonly repository: typeof EventCategory,
  ) {}

  async findAll(payload): Promise<EventCategory[]> {
    const { q } = payload;
    const filter = {
      [Op.or]: [
        {
          name: {
            [Op.substring]: q,
          },
        },
        {
          description: {
            [Op.substring]: q,
          },
        },
      ],
    };

    return await this.repository.findAll<EventCategory>({
      where: filter,
    });
  }

  async findOne(id: number) {
    return await this.repository.findByPk(id);
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: CreateEventCategoryDto) {
    return await this.repository.create<EventCategory>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateEventCategoryDto) {
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
