import {
  COUPON_PROVIDER,
  MEMBERCOUPON_PROVIDER,
  MEMBERTIER_PROVIDER,
  MEMBER_PROVIDER,
  NOTIFICATION_PROVIDER,
} from '@/Helpers/contants';
import { Member } from './entities/member.entity';
import { LogNotification } from '../notifications/entities/logNotification.entity';
import { MemberTier } from '../memberTier/entities/memberTier.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { MemberCoupon } from './entities/memberCoupon.entity';

export const MembersProvider = [
  {
    provide: MEMBER_PROVIDER,
    useValue: Member,
  },
  {
    provide: MEMBERTIER_PROVIDER,
    useValue: MemberTier,
  },
  {
    provide: NOTIFICATION_PROVIDER,
    useValue: LogNotification,
  },
  {
    provide: COUPON_PROVIDER,
    useValue: Coupon,
  },
  {
    provide: MEMBERCOUPON_PROVIDER,
    useValue: MemberCoupon,
  },
];
