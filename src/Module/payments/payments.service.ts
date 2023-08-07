import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_PROVIDER } from '@/Helpers/contants';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Op } from 'sequelize';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PAYMENT_PROVIDER)
    private readonly repository: typeof Payment,
  ) {}

  async findAll(payload) {
    const { q, status, is_published } = payload;
    let searchKey = typeof q === 'undefined' ? '' : q;

    const whereCond = {};

    if (q && q !== '' && q !== null) {
      whereCond['name'] = {
        [Op.like]: `%${q}%`,
      };
    }

    if (status && status !== '') {
      whereCond['status'] = status;
    }

    if (is_published && is_published !== '') {
      whereCond['is_published'] = is_published;
    }

    return await this.repository.findAll({
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
        id,
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

  async create(payload: CreatePaymentDto) {
    return await this.repository.create<Payment>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdatePaymentDto) {
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
