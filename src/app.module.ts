import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from '@/Database/database.module';

import { PaymentsModule } from '@/Module/payments/payments.module';
import { CustomersModule } from './Module/customer/customers.module';
import { UsersModule } from './Module/users/users.module';
import { OnlinePaymentsModule } from './Module/onlinePayments/onlinePayments.module';
import { DeliveriesModule } from './Module/deliveries/deliveries.module';
import { ContentsModule } from './Module/content/contents.module';
import { DiscountsModule } from './Module/discounts/discounts.module';
import { TransactionsModule } from './Module/transaction/transactions.module';
import { ProductsModule } from './Module/product/products.module';
import { ProductCategoryModule } from './Module/productCategory/productCategories.module';
import { ProductCollectionsModule } from './Module/productCollection/productCollections.module';
import { NotificationsModule } from './Module/notifications/notifications.module';
import { AuthModule } from './Module/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from './Middleware/logger.middleware';
import { ImportModule } from './Module/import/imports.module';
import { APP_FILTER } from '@nestjs/core';
import { InternalServerErrorFilter } from './InternalServerErrorFilter';
import { ProductTagModule } from './Module/productTag/productTag.module';
import { NewsModule } from './Module/news/news.module';
import { BannerImagesModule } from './Module/bannerImage/bannerImages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),

    DatabaseModule,
    UsersModule,

    PaymentsModule,
    CustomersModule,
    UsersModule,
    ProductCategoryModule,
    ProductCollectionsModule,
    ProductsModule,
    ProductsModule,
    ProductTagModule,
    PaymentsModule,
    OnlinePaymentsModule,
    DeliveriesModule,
    ContentsModule,
    NewsModule,
    BannerImagesModule,
    DiscountsModule,
    TransactionsModule,
    NotificationsModule,
    AuthModule,
    ImportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: InternalServerErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
