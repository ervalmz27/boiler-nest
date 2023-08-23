import { Inject, Injectable } from '@nestjs/common';
import { MEMBER_PROVIDER } from '@/Helpers/contants';
import { Customer } from './entities/customer.entity';
import { Op } from 'sequelize';
import * as moment from 'moment-timezone';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(MEMBER_PROVIDER)
    private readonly repository: typeof Customer,
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

  async update(id: number, payload: any) {
    return await this.repository.update(payload, {
      where: { id },
    });
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