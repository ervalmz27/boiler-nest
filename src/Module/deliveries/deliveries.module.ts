import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveryFreeSetupServices } from './deliveryFreeSetup.service';
import { DeliveriesProvider } from './deliveries.providers';
import { DeliveriesController } from './deliveries.controller';

@Module({
  controllers: [DeliveriesController],
  providers: [
    DeliveriesService,
    DeliveryFreeSetupServices,
    ...DeliveriesProvider,
  ],
})
export class DeliveriesModule {}
