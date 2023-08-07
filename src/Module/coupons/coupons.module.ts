import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsProvider } from './coupons.providers';
import { CouponsController } from './coupons.controller';
import { CouponTiersService } from './couponTiers.service';
import { MembersService } from '../member/members.service';
import { MemberCouponsService } from '../member/memberCoupon.service';

@Module({
  controllers: [CouponsController],
  providers: [
    CouponsService,
    CouponTiersService,
    MembersService,
    MemberCouponsService,
    ...CouponsProvider,
  ],
})
export class CouponsModule {}
