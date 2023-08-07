import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from '@/Database/database.module';
import { UsersModule } from '@/Module/users/users.module';
import { FeedsModule } from '@/Module/feeds/feeds.module';
import { PaymentsModule } from '@/Module/payments/payments.module';
import { MembersModule } from './Module/member/members.module';
import { AdminsModule } from './Module/admin/admins.module';
import { MemberTierModule } from './Module/memberTier/memberTiers.module';
import { EventCategoryModule } from './Module/eventCategory/eventCategories.module';
import { ArticleCategoryModule } from './Module/articleCategory/articleCategories.module';
import { OnlinePaymentsModule } from './Module/onlinePayments/onlinePayments.module';
import { DeliveriesModule } from './Module/deliveries/deliveries.module';
import { ContentsModule } from './Module/content/contents.module';
import { EventCollectionsModule } from './Module/eventCollection/eventCollections.module';
import { DiscountsModule } from './Module/discounts/discounts.module';
import { VouchersModule } from './Module/vouchers/vouchers.module';
import { CouponsModule } from './Module/coupons/coupons.module';
import { ArticlesModule } from './Module/article/articles.module';
import { TransactionsModule } from './Module/transaction/transactions.module';
import { ProductsModule } from './Module/product/products.module';
import { ProductCategoryModule } from './Module/productCategory/productCategories.module';
import { ProductSavedModule } from './Module/productsSaved/productSaved.module';
import { ProductCollectionsModule } from './Module/productCollection/productCollections.module';
import { EventsModule } from './Module/event/events.module';
import { NotificationsModule } from './Module/notifications/notifications.module';
import { AuthModule } from './Module/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MessageModule } from './Module/messages/messages.module';
import { CartModule } from './Module/cart/cart.module';
import { LoggerMiddleware } from './Middleware/logger.middleware';
import { ImportModule } from './Module/import/imports.module';
import { APP_FILTER } from '@nestjs/core';
import { InternalServerErrorFilter } from './InternalServerErrorFilter';

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
    FeedsModule,
    PaymentsModule,
    MembersModule,
    AdminsModule,
    MemberTierModule,
    EventCategoryModule,
    ProductCategoryModule,
    ProductCollectionsModule,
    ProductsModule,
    ProductsModule,
    ProductSavedModule,
    ArticleCategoryModule,
    PaymentsModule,
    OnlinePaymentsModule,
    DeliveriesModule,
    ContentsModule,
    EventCollectionsModule,
    DiscountsModule,
    VouchersModule,
    CouponsModule,
    ArticlesModule,
    EventsModule,
    TransactionsModule,
    NotificationsModule,
    AuthModule,
    MessageModule,
    CartModule,
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
