import { Inject, Injectable } from '@nestjs/common';
import { DELIVERY_FREESETUP_PROVIDER } from '@/Helpers/contants';
import { DeliveryFreeSetup } from './entities/deliveryFreeSetup.entity';

@Injectable()
export class DeliveryFreeSetupServices {
  constructor(
    @Inject(DELIVERY_FREESETUP_PROVIDER)
    private readonly repository: typeof DeliveryFreeSetup,
  ) {}

  async findFreeSetup() {
    return await this.repository.findOne({
      where: { id: 1 },
    });
  }

  async updateFreeSetup(id, payload) {
    return await this.repository.update(payload, {
      where: { id: id },
    });
  }

  async update(id: number, payload: any) {
    return await this.repository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }
}
