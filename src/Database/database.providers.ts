import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '@/Helpers/contants';
import { Payment } from '@/Module/payments/entities/payment.entity';
import { Customer } from '@/Module/customer/entities/customer.entity';
import { User } from '@/Module/users/entities/users.entity';
import { ProductCollection } from '@/Module/productCollection/entities/productCollection.entity';
import { Product } from '@/Module/product/entities/product.entity';
import { ProductCategory } from '@/Module/productCategory/entities/productCategory.entity';
import { OnlinePayment } from '@/Module/onlinePayments/entities/onlinePayment.entity';
import { Delivery } from '@/Module/deliveries/entities/delivery.entity';
import { Content } from '@/Module/content/entities/content.entity';

import { DeliveryFreeSetup } from '@/Module/deliveries/entities/deliveryFreeSetup.entity';
import { Discount } from '@/Module/discounts/entities/discount.entity';
import { Transaction } from '@/Module/transaction/entities/transaction.entity';
import { TransactionDetail } from '@/Module/transaction/entities/transactionProductDetail.entity';

import { ProductOption } from '@/Module/product/entities/productOption.entity';
import { ProductMedia } from '@/Module/product/entities/productMedia.entity';
import { ProductCollectionItem } from '@/Module/productCollection/entities/productCollectionItem.entity';
import { Notifications } from '@/Module/notifications/entities/notifications.entity';
import { ProductTag } from '@/Module/productTag/entities/productTag.entity';
import { ProductWishlist } from '@/Module/product/entities/productWishlist.entity';
import { TransactionLog } from '@/Module/transaction/entities/transactionPaymentLog.entity';

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
        User,
        Payment,
        Customer,
        OnlinePayment,
        Delivery,
        Content,
        DeliveryFreeSetup,
        Discount,
        Product,
        ProductTag,
        ProductCategory,
        ProductOption,
        ProductMedia,
        ProductCollectionItem,
        ProductCollection,
        ProductWishlist,
        Transaction,
        TransactionDetail,
        TransactionLog,
        Notifications,
      ]);

      await sequelize.sync({
        force: false,
      });
      return sequelize;
    },
  },
];
