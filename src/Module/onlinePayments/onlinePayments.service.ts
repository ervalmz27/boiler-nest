import { Inject, Injectable } from '@nestjs/common';
import { ONLINEPAYMENT_PROVIDER } from '@/Helpers/contants';
import { OnlinePayment } from './entities/onlinePayment.entity';
import { UpdateOnlinePaymentDto } from './dto/update-onlinePayment.dto';
import { Op } from 'sequelize';
@Injectable()
export class OnlinePaymentsService {
  constructor(
    @Inject(ONLINEPAYMENT_PROVIDER)
    private readonly repository: typeof OnlinePayment,
  ) {}

  async findAll(whereCond = {}, raw = true) {
    return await this.repository.findAll({
      where: whereCond,
      order: [
        ['status', 'DESC'],
        ['type', 'DESC'],
      ],
      raw,
    });
  }

  async findAll2(payload, raw = true) {
    const { q, status } = payload;

    const whereCond = {};

    if (q && q !== '') {
      whereCond['name'] = {
        [Op.like]: `%${q}%`,
      };
    }

    if (status && status !== '') {
      whereCond['status'] = status;
    }

    return await this.repository.findAll({
      where: whereCond,
      order: [
        ['status', 'DESC'],
        ['type', 'DESC'],
      ],
      raw,
    });
  }

  async findStripeConfig() {
    return await this.repository.findOne({
      where: {
        type: 'STRIPE',
        status: 1,
      },
      raw: true,
    });
  }

  async findById(id) {
    return await this.repository.findOne({
      where: {
        id,
      },
    });
  }

  async findByType(type: string) {
    return await this.repository.findOne({
      where: {
        type: type,
      },
      raw: true,
    });
  }

  async findPaymeConfig() {
    if (process.env.APP_ENV === 'development') {
      return this.repository.findOne({
        where: {
          type: 'PAYME',
          environment: 'Sandbox',
          status: 1,
        },
        attributes: [
          'id',
          'signing_key_id',
          'signing_key',
          'client_id',
          'secret_key',
        ],
        raw: true,
      });
    }

    return this.repository.findOne({
      where: {
        type: 'PAYME',
        environment: 'production',
        status: 1,
      },
      attributes: [
        'id',
        'signing_key_id',
        'signing_key',
        'client_id',
        'secret_key',
      ],
      raw: true,
    });
  }

  async markOthersAsInactive(type) {
    return await this.repository.update(
      {
        status: 0,
      },
      {
        where: {
          type: type,
        },
      },
    );
  }

  async updateConfigByType(type, payload: UpdateOnlinePaymentDto) {
    return await this.repository.update(
      { ...payload },
      {
        where: {
          type: type,
        },
      },
    );
  }

  async createConfigByType(payload: UpdateOnlinePaymentDto) {
    return await this.repository.create({
      ...payload,
      raw: true,
    });
  }

  async create(payload: any) {
    return await this.repository.create({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: any) {
    return this.repository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async remove(id: number) {
    return this.repository.destroy({ where: { id } });
  }
}
