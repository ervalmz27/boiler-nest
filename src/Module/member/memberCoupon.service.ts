import { Inject, Injectable } from '@nestjs/common';
import { MEMBERCOUPON_PROVIDER } from '@/Helpers/contants';
import { MemberCoupon } from './entities/memberCoupon.entity';
import { Op } from 'sequelize';
import * as moment from 'moment-timezone';

@Injectable()
export class MemberCouponsService {
  constructor(
    @Inject(MEMBERCOUPON_PROVIDER)
    private readonly repository: typeof MemberCoupon,
  ) {}

  async getMemberAvailableCoupon({ member_id }) {
    const currentDate = moment().tz('Asia/Hong_Kong').format();
    return this.repository.findAll({
      where: {
        member_id: member_id,
        status: 'AVAILABLE',
        expired_at: {
          [Op.gte]: currentDate,
        },
      },
      include: {
        nested: true,
        all: true,
      },
    });
  }

  async getAllMemberCoupon(memberId) {
    return this.repository.findAll({
      where: {
        member_id: memberId,
      },
      include: {
        nested: true,
        all: true,
      },
    });
  }

  async addCoupon(payload: any) {
    return this.repository.create(payload);
  }

  async bulkCreate(members, couponData) {
    let payload = [];
    members.forEach((e) => {
      const lastDate = moment(couponData.campaign_end)
        .tz('Asia/Hong_Kong')
        .format();

      payload.push({
        member_id: e,
        coupon_id: couponData.id,
        start_at: couponData.campaign_start,
        expired_at: couponData.campaign_end + ' 23:59:00',
        status: 'AVAILABLE',
      });
    });
    return this.repository.bulkCreate(payload);
  }

  async markAsUsed(memberCouponId) {
    return this.repository.update(
      {
        status: 'USED',
      },
      {
        where: {
          id: memberCouponId,
        },
      },
    );
  }

  async checkExpiredCoupon() {
    const currentDate = moment().tz('Asia/Hong_Kong').format();
    return this.repository.findAll({
      where: {
        status: 'AVAILABLE',
        expired_at: {
          [Op.lt]: currentDate,
        },
      },
      attributes: ['id'],
      raw: true,
    });
  }

  async markAsExpired(ids) {
    return this.repository.update(
      {
        status: 'EXPIRED',
      },
      {
        where: {
          id: ids,
        },
      },
    );
  }
}
