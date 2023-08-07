import { Inject, Injectable } from '@nestjs/common';
import { DELIVERY_PROVIDER } from '@/Helpers/contants';
import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Op } from 'sequelize';

@Injectable()
export class DeliveriesService {
  constructor(
    @Inject(DELIVERY_PROVIDER)
    private readonly repository: typeof Delivery,
  ) {}

  async findAll(payload): Promise<Delivery[]> {
    const { q = '', status, is_published } = payload;
    const whereCond = {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${q}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${q}%`,
          },
        },
      ],
    };

    if (status && status !== '') whereCond['status'] = status;
    if (is_published && is_published !== '')
      whereCond['is_published'] = is_published;

    return await this.repository.findAll<Delivery>({
      order: [['status', 'DESC']],
      where: whereCond,
    });
  }

  async findOne(id: number) {
    return await this.repository.findByPk(id);
  }

  async findById(id, raw = true) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      raw,
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: CreateDeliveryDto) {
    return await this.repository.create<Delivery>({ ...payload });
  }

  async update(id: number, payload: UpdateDeliveryDto) {
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
}
