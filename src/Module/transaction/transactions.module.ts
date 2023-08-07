import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsProvider } from './transactions.providers';
import { TransactionsController } from './transactions.controller';
import { ProductsService } from '../product/products.service';
import { ProductOptionsService } from '../product/productOptions.service';
import { TransactionProductDetailsService } from './transactionProductDetail.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/Helpers/contants';
import { MembersService } from '../member/members.service';
import { CouponsService } from '../coupons/coupons.service';
import { DiscountsService } from '../discounts/discounts.service';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PointLogService } from '../pointLog/pointLog.service';
import { VoucherSettingsService } from '../vouchers/voucherSettings.service';
import { CartService } from '../cart/cart.service';
import { MemberCouponsService } from '../member/memberCoupon.service';
import { TransactionEventService } from './transactionEvent.service';
import { EventTicketsService } from '../event/eventTickets.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '133600s' },
    }),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionProductDetailsService,
    TransactionEventService,
    ProductsService,
    ProductOptionsService,
    MembersService,
    CouponsService,
    DiscountsService,
    DeliveriesService,
    PaymentsService,
    NotificationsService,
    PointLogService,
    VoucherSettingsService,
    CartService,
    MemberCouponsService,
    EventTicketsService,
    ...TransactionsProvider,
  ],
})
export class TransactionsModule {}
