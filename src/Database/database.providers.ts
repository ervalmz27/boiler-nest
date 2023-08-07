import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '@/Helpers/contants';
import { Users } from '@/Module/users/entities/user.entity';
import { UserTier } from '@/Module/users/entities/userTier.entity';
import { Feeds } from '@/Module/feeds/entities/feed.entity';
import { Payment } from '@/Module/payments/entities/payment.entity';
import { Member } from '@/Module/member/entities/member.entity';
import { MemberTier } from '@/Module/memberTier/entities/memberTier.entity';
import { Admin } from '@/Module/admin/entities/admin.entity';
import { ProductCollection } from '@/Module/productCollection/entities/productCollection.entity';
import { Product } from '@/Module/product/entities/product.entity';
import { ProductCategory } from '@/Module/productCategory/entities/productCategory.entity';
import { EventCategory } from '@/Module/eventCategory/entities/eventCategory.entity';
import { ArticleCategory } from '@/Module/articleCategory/entities/articleCategory.entity';
import { OnlinePayment } from '@/Module/onlinePayments/entities/onlinePayment.entity';
import { Delivery } from '@/Module/deliveries/entities/delivery.entity';
import { Content } from '@/Module/content/entities/content.entity';
import { EventCollection } from '@/Module/eventCollection/entities/eventCollection.entity';
import { DeliveryFreeSetup } from '@/Module/deliveries/entities/deliveryFreeSetup.entity';
import { Discount } from '@/Module/discounts/entities/discount.entity';
import { Voucher } from '@/Module/vouchers/entities/voucher.entity';
import { Coupon } from '@/Module/coupons/entities/coupon.entity';
import { Article } from '@/Module/article/entities/article.entity';

import { Event } from '@/Module/event/entities/event.entity';
import { Transaction } from '@/Module/transaction/entities/transaction.entity';
import { TransactionProductDetail } from '@/Module/transaction/entities/transactionProductDetail.entity';
import { VoucherSetting } from '@/Module/vouchers/entities/voucherSetting.entity';
import { ProductOption } from '@/Module/product/entities/productOption.entity';
import { ProductMedia } from '@/Module/product/entities/productMedia.entity';
import { ProductCollectionItem } from '@/Module/productCollection/entities/productCollectionItem.entity';
import { ProductSaved } from '@/Module/productsSaved/entities/productSaved.entity';
import { LogNotification } from '@/Module/notifications/entities/logNotification.entity';
import { EventTimeslot } from '@/Module/event/entities/eventTimeslot.entity';
import { EventTicket } from '@/Module/event/entities/eventTicket.entity';
import { Notifications } from '@/Module/notifications/entities/notifications.entity';
import { Messages } from '@/Module/messages/entities/messages.entity';
import { MessageDetails } from '@/Module/messages/entities/messageDetail.entity';
import { CouponTier } from '@/Module/coupons/entities/couponTier.entity';
import { Cart } from '@/Module/cart/entities/cart.entity';
import { PointLog } from '@/Module/pointLog/pointLog.entity';
import { MemberCoupon } from '@/Module/member/entities/memberCoupon.entity';
import { EventCollectionItem } from '@/Module/eventCollection/entities/eventCollectionItem.entity';
import { EventForm } from '@/Module/event/entities/eventForm.entity';
import { TransactionEvent } from '@/Module/transaction/entities/transactionEvent.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }

      const sequelize = new Sequelize(config);

      sequelize.addModels([
        Users,
        UserTier,
        Feeds,
        Payment,
        Member,
        MemberTier,
        PointLog,
        Admin,
        ArticleCategory,
        OnlinePayment,
        Delivery,
        Content,
        DeliveryFreeSetup,
        Discount,
        Voucher,
        VoucherSetting,
        Coupon,
        Article,
        Product,
        ProductCategory,
        ProductOption,
        ProductMedia,
        ProductCollectionItem,
        ProductSaved,
        ProductCollection,
        Event,
        EventTimeslot,
        EventTicket,
        EventCategory,
        EventCollection,
        EventCollectionItem,
        EventForm,
        Transaction,
        TransactionProductDetail,
        TransactionEvent,
        LogNotification,
        Notifications,
        Messages,
        MessageDetails,
        CouponTier,
        Cart,
        MemberCoupon,
      ]);

      await sequelize.sync({
        force: false,
      });
      return sequelize;
    },
  },
];
