import { Inject, Injectable } from '@nestjs/common';
import { VOUCHER_SETTING_PROVIDER } from '@/Helpers/contants';
import { VoucherSetting } from './entities/voucherSetting.entity';

@Injectable()
export class VoucherSettingsService {
  constructor(
    @Inject(VOUCHER_SETTING_PROVIDER)
    private readonly repository: typeof VoucherSetting,
  ) {}

  async findOne(raw = false) {
    return await this.repository.findOne({ where: { id: 1 }, raw });
  }

  async create(payload: any) {
    return await this.repository.create({ ...payload });
  }

  async update(payload: any) {
    const id = 1;
    return await this.repository.update(
      {
        spend_amount: payload.spend_amount,
        reward_amount: payload.reward_amount,
        description: payload.description,
      },
      {
        where: { id },
      },
    );
  }
}
