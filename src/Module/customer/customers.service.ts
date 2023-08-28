import { Inject, Injectable } from '@nestjs/common';
import { CUSTOMER_PROVIDER, CUSTOMER_BANK_PROVIDER } from '@/Helpers/contants';
import { Customer } from './entities/customer.entity';
import { Op } from 'sequelize';
import * as moment from 'moment-timezone';
import { CustomerBank } from './entities/customerBank entity';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(CUSTOMER_PROVIDER)
    private readonly repository: typeof Customer,

    @Inject(CUSTOMER_BANK_PROVIDER)
    private readonly bankRepository: typeof CustomerBank,
  ) {}

  async getLastId() {
    const data = await this.repository.findOne({
      order: [['id', 'DESC']],
      attributes: ['id'],
      raw: true,
    });

    return data === null ? 1 : data.id + 1;
  }

  async countByTier(tierId) {
    return await this.repository.count({
      where: {
        tier_id: tierId,
      },
    });
  }

  async findByEmail(email) {
    const data = await this.repository.findOne({
      where: {
        email,
      },
      raw: true,
    });
    return data;
  }

  async findByEmail2(email) {
    const data = await this.repository.findOne({
      where: {
        email,
      },
    });
    return data;
  }

  async findByCustomerTier(tiers, raw = true) {
    return this.repository.findAll({
      where: {
        tier_id: tiers,
      },
      raw,
    });
  }

  async findByUsername(username) {
    const data = await this.repository.findOne({
      where: {
        username,
      },
      raw: true,
    });
    return data;
  }

  async findByPhone(phone) {
    const data = await this.repository.findOne({
      where: {
        phone,
      },
      raw: true,
    });
    return data;
  }

  async findByPhone2(phone) {
    const data = await this.repository.findOne({
      where: {
        phone,
      },
    });
    return data;
  }

  async findAll(payload) {
    const filter = {};

    return this.repository.findAll({
      where: filter,
      order: [['created_at', 'asc']],
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: { id },
      include: [{ model: CustomerBank }],
    });
  }

  async findBytoken(token: string) {
    return await this.repository.findOne({
      where: { token: token },
    });
  }

  async getSimpleProfile(token: string) {
    return await this.repository.findOne({
      where: { token: token },
      attributes: {
        exclude: ['password'],
      },
      raw: true,
    });
  }

  async findByTier(tier) {
    return await this.repository.findAll({
      where: {
        tier_id: tier,
      },
      raw: true,
    });
  }

  async addPoints(memberId, points) {
    return await this.repository.increment('points', {
      by: points,
      where: {
        id: memberId,
      },
    });
  }

  async create(payload: any) {
    return await this.repository.create(payload);
  }

  async addCustomerBank(customerId, payload) {
    const ret = [];
    for (const p of payload) {
      p['customer_id'] = customerId;
      ret.push(p);
    }
    return await this.bankRepository.bulkCreate(ret);
  }

  async update(id: number, payload: any) {
    return await this.repository.update(payload, {
      where: { id },
    });
  }

  async updateCustomerBank(id, payload) {
    console.log(payload);
    for (const p of payload) {
      if (p.id === null) {
        await this.bankRepository.create({
          customer_id: id,
          name: p.name,
          account_number: p.account_number,
          is_default: parseInt(p.is_default),
        });
      } else {
        await this.bankRepository.update(
          {
            name: p.name,
            account_number: p.account_number,
            is_default: p.is_default,
          },
          {
            where: {
              id: p.id,
            },
          },
        );
      }
    }
  }

  async deletedBanks(banks) {
    for (const bank of banks) {
      await this.bankRepository.destroy({
        where: {
          id: bank,
        },
      });
    }
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }

  async removeByToken(token: string) {
    return await this.repository.destroy({ where: { token: token } });
  }

  async getBirthdayCustomer() {
    const currentDate = moment().tz('Asia/Hong_Kong').format();
    return this.repository.findAll({
      where: {
        birth_date: currentDate,
      },
      attributes: ['id', 'birth_date', 'tier_id'],
    });
  }

  async get(attr = {}) {
    return this.repository.findAll(attr);
  }

  async updatePoints(customer_id, points) {
    return this.repository.update(
      {
        points: points,
      },
      {
        where: {
          id: customer_id,
        },
      },
    );
  }
}
