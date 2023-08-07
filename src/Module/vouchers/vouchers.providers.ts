import { VOUCHER_PROVIDER, VOUCHER_SETTING_PROVIDER } from '@/Helpers/contants';
import { Voucher } from './entities/voucher.entity';
import { VoucherSetting } from './entities/voucherSetting.entity';

export const VouchersProvider = [
  {
    provide: VOUCHER_SETTING_PROVIDER,
    useValue: VoucherSetting,
  },
  {
    provide: VOUCHER_PROVIDER,
    useValue: Voucher,
  },
];
