import { Module } from '@nestjs/common';
import { ProductTagService } from './productTag.service';
import { ProductTagProvider } from './productTag.providers';
import { ProductTagController } from './productTag.controller';

@Module({
  controllers: [ProductTagController],
  providers: [ProductTagService, ...ProductTagProvider],
})
export class ProductTagModule {}
