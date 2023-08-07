import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import * as moment from 'moment-timezone';
import { COUPON_PROVIDER } from '@/Helpers/contants';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponTier } from './entities/couponTier.entity';

@Injectable()
export class CouponsService {
  constructor(
    @Inject(COUPON_PROVIDER)
    private readonly repository: typeof Coupon,
  ) {}

  async findAll(searchKey: string) {
    let payload = {};
    if (typeof searchKey !== 'undefined') {
      payload = {
        order: [['created_at', 'desc']],
        where: {
          [Op.or]: [
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
      };
    }
    return await this.repository.findAll(payload);
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      include: { all: true, nested: true },
    });
  }

  async findById(id: number, raw = true) {
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

  async create(payload: CreateCouponDto) {
    return await this.repository.create<Coupon>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateCouponDto) {
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

  async getAvailableRegisterCouponByTier(tiers = []) {
    const currentDate = moment().tz('Asia/Hong_Kong').format();
    return this.repository.findAll({
      where: {
        category: 'First Time Registration',
        status: 1,
        campaign_end: {
          [Op.lte]: currentDate,
        },
      },
      include: [
        {
          model: CouponTier,
          where: {
            tier_id: tiers,
          },
        },
      ],
    });
  }

  async getBirthDayCoupon(tier) {
    const currentDate = moment().tz('Asia/Hong_Kong').format();
    const currentMonth = moment().tz('Asia/Hong_Kong').format('MMMM');
    return this.repository.findAll({
      where: {
        category: 'Birthday',
        status: 1,
        category_birthday_month: {
          [Op.like]: `%${currentMonth}%`,
        },
        campaign_end: {
          [Op.lte]: currentDate,
        },
      },
      include: [
        {
          model: CouponTier,
          where: {
            tier_id: tier,
          },
        },
      ],
    });
  }
}
