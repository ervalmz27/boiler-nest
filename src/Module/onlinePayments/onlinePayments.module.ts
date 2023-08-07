import { Module } from '@nestjs/common';
import { OnlinePaymentsService } from './onlinePayments.service';
import { OnlinePaymentsProvider } from './onlinePayments.providers';
import { OnlinePaymentsController } from './onlinePayments.controller';
import { TransactionsService } from '../transaction/transactions.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [OnlinePaymentsController],
  providers: [
    OnlinePaymentsService,
    TransactionsService,
    NotificationsService,
    ...OnlinePaymentsProvider,
  ],
})
export class OnlinePaymentsModule {}
