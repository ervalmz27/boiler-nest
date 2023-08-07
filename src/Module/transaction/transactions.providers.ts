import {
  CART_PROVIDER,
  COUPON_PROVIDER,
  DELIVERY_PROVIDER,
  DISCOUNT_PROVIDER,
  EVENT_TICKET_PROVIDER,
  MEMBERCOUPON_PROVIDER,
  MEMBER_PROVIDER,
  NOTIFICATION_PROVIDER,
  PAYMENT_PROVIDER,
  POINTLOG_PROVIDER,
  PRODUCT_OPTION_PROVIDER,
  PRODUCT_PROVIDER,
  TRANSACTION_EVENT_PROVIDER,
  TRANSACTION_PRODUCT_DETAIL_PROVIDER,
  TRANSACTION_PRODUCT_PROVIDER,
  TRANSACTION_PROVIDER,
  VOUCHER_SETTING_PROVIDER,
} from '@/Helpers/contants';
import { Transaction } from './entities/transaction.entity';
import { ProductOption } from '../product/entities/productOption.entity';
import { Product } from '../product/entities/product.entity';
import { TransactionProductDetail } from './entities/transactionProductDetail.entity';
import { Member } from '../member/entities/member.entity';
import { Delivery } from '../deliveries/entities/delivery.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Discount } from '../discounts/entities/discount.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Notifications } from '../notifications/entities/notifications.entity';
import { PointLog } from '../pointLog/pointLog.entity';
import { VoucherSetting } from '../vouchers/entities/voucherSetting.entity';
import { Cart } from '../cart/entities/cart.entity';
import { MemberCoupon } from '../member/entities/memberCoupon.entity';
import { TransactionEvent } from './entities/transactionEvent.entity';
import { EventTicket } from '../event/entities/eventTicket.entity';

export const TransactionsProvider = [
  {
    provide: TRANSACTION_PROVIDER,
    useValue: Transaction,
  },
  {
    provide: PRODUCT_PROVIDER,
    useValue: Product,
  },
  {
    provide: PRODUCT_OPTION_PROVIDER,
    useValue: ProductOption,
  },
  {
    provide: TRANSACTION_PRODUCT_DETAIL_PROVIDER,
    useValue: TransactionProductDetail,
  },
  {
    provide: MEMBER_PROVIDER,
    useValue: Member,
  },
  {
    provide: DELIVERY_PROVIDER,
    useValue: Delivery,
  },
  {
    provide: COUPON_PROVIDER,
    useValue: Coupon,
  },
  {
    provide: DISCOUNT_PROVIDER,
    useValue: Discount,
  },
  {
    provide: PAYMENT_PROVIDER,
    useValue: Payment,
  },
  {
    provide: NOTIFICATION_PROVIDER,
    useValue: Notifications,
  },
  {
    provide: MEMBER_PROVIDER,
    useValue: Member,
  },
  {
    provide: POINTLOG_PROVIDER,
    useValue: PointLog,
  },
  {
    provide: VOUCHER_SETTING_PROVIDER,
    useValue: VoucherSetting,
  },
  {
    provide: CART_PROVIDER,
    useValue: Cart,
  },
  {
    provide: MEMBERCOUPON_PROVIDER,
    useValue: MemberCoupon,
  },
  {
    provide: TRANSACTION_EVENT_PROVIDER,
    useValue: TransactionEvent,
  },
  {
    provide: EVENT_TICKET_PROVIDER,
    useValue: EventTicket,
  },
];
