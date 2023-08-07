import { Inject, Injectable } from '@nestjs/common';
import { COUPON_TIER_PROVIDER } from '@/Helpers/contants';
import { CouponTier } from './entities/couponTier.entity';

@Injectable()
export class CouponTiersService {
  constructor(
    @Inject(COUPON_TIER_PROVIDER)
    private readonly repository: typeof CouponTier,
  ) {}

  async bulkCreate({ id, tiers }) {
    let newPayload = [];
    tiers.forEach((e) => {
      newPayload.push({
        coupon_id: id,
        tier_id: e,
      });
    });
    return this.repository.bulkCreate(newPayload);
  }

  async truncate({ coupon_id }) {
    await this.repository.destroy({
      where: {
        coupon_id: coupon_id,
      },
      force: true,
    });
  }
}
