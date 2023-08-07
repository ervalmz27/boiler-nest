import {
  COUPON_PROVIDER,
  COUPON_TIER_PROVIDER,
  MEMBERCOUPON_PROVIDER,
  MEMBER_PROVIDER,
} from '@/Helpers/contants';
import { Coupon } from './entities/coupon.entity';
import { CouponTier } from './entities/couponTier.entity';
import { Member } from '../member/entities/member.entity';
import { MemberCoupon } from '../member/entities/memberCoupon.entity';

export const CouponsProvider = [
  {
    provide: COUPON_PROVIDER,
    useValue: Coupon,
  },
  {
    provide: COUPON_TIER_PROVIDER,
    useValue: CouponTier,
  },
  {
    provide: MEMBER_PROVIDER,
    useValue: Member,
  },
  {
    provide: MEMBERCOUPON_PROVIDER,
    useValue: MemberCoupon,
  },
];
