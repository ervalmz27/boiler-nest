import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { TransactionsProvider } from './transactions.providers';
import { TransactionsController } from './transactions.controller';
import { ProductsService } from '../product/products.service';
import { ProductOptionsService } from '../product/productOptions.service';
import { TransactionProductDetailsService } from './services/transactionProductDetail.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/Helpers/contants';
import { CustomersService } from '../customer/customers.service';
import { DiscountsService } from '../discounts/discounts.service';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TransactionLogServices } from './services/transactionLog.service';

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
    TransactionLogServices,
    ProductsService,
    ProductOptionsService,
    CustomersService,
    DiscountsService,
    DeliveriesService,
    PaymentsService,
    NotificationsService,
    ...TransactionsProvider,
  ],
})
export class TransactionsModule {}
