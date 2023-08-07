import {
  DELIVERY_FREESETUP_PROVIDER,
  DELIVERY_PROVIDER,
} from '@/Helpers/contants';
import { Delivery } from './entities/delivery.entity';
import { DeliveryFreeSetup } from './entities/deliveryFreeSetup.entity';

export const DeliveriesProvider = [
  {
    provide: DELIVERY_PROVIDER,
    useValue: Delivery,
  },
  {
    provide: DELIVERY_FREESETUP_PROVIDER,
    useValue: DeliveryFreeSetup,
  },
];
