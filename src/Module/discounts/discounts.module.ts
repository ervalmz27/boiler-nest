import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsProvider } from './discounts.providers';
import { DiscountsController } from './discounts.controller';

@Module({
  controllers: [DiscountsController],
  providers: [DiscountsService, ...DiscountsProvider],
})
export class DiscountsModule {}
