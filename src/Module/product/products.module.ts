import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsProvider } from './products.providers';
import { ProductsController } from './products.controller';
import { ProductOptionsService } from './productOptions.service';
import { ProductMediasService } from './productMedias.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ProductCategoriesService } from '../productCategory/productCategories.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductOptionsService,
    ProductMediasService,
    ProductCategoriesService,
    NotificationsService,
    ...ProductsProvider,
  ],
})
export class ProductsModule {}