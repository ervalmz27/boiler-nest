import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsProvider } from './payments.providers';
import { PaymentsController } from './payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, ...PaymentsProvider],
})
export class PaymentsModule {}
