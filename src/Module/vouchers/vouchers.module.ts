import { Module } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VouchersProvider } from './vouchers.providers';
import { VouchersController } from './vouchers.controller';
import { VoucherSettingsService } from './voucherSettings.service';

@Module({
  controllers: [VouchersController],
  providers: [VouchersService, VoucherSettingsService, ...VouchersProvider],
})
export class VouchersModule {}
