import { Inject, Injectable } from '@nestjs/common';
import { DISCOUNT_PROVIDER } from '@/Helpers/contants';
import { Discount } from './entities/discount.entity';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Op } from 'sequelize';
import moment from 'moment';
import 'moment-timezone';

@Injectable()
export class DiscountsService {
  constructor(
    @Inject(DISCOUNT_PROVIDER)
    private readonly repository: typeof Discount,
  ) {}

  async findAll(searchKey: string) {
    return await this.repository.findAll({
      order: [['status', 'DESC']],
      where: {
        [Op.or]: [
          {
            code: {
              [Op.substring]: searchKey,
            },
          },
          {
            name: {
              [Op.substring]: searchKey,
            },
          },
          {
            description: {
              [Op.substring]: searchKey,
            },
          },
        ],
      },
    });
  }

  async findByCode(code) {
    const currentDate = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Hong_Kong',
    });
    return this.repository.findOne({
      where: {
        code,
        status: 1,
        end_at: {
          [Op.gte]: currentDate,
        },
      },
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

  async findOne2(payload, raw = false) {
    return this.repository.findOne({
      where: payload,
      raw,
    });
  }

  async create(payload: CreateDiscountDto) {
    return await this.repository.create<Discount>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateDiscountDto) {
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
