import { Module } from '@nestjs/common';
import { ProductTagService } from './ProductTag.service';
import { ProductTagProvider } from './ProductTag.providers';
import { ProductTagController } from './ProductTag.controller';

@Module({
  controllers: [ProductTagController],
  providers: [ProductTagService, ...ProductTagProvider],
})
export class ProductTagModule {}
