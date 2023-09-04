import {
  CART_PROVIDER,
  COUPON_PROVIDER,
  DELIVERY_PROVIDER,
  DISCOUNT_PROVIDER,
  EVENT_TICKET_PROVIDER,
  MEMBERCOUPON_PROVIDER,
  CUSTOMER_PROVIDER,
  NOTIFICATION_PROVIDER,
  PAYMENT_PROVIDER,
  PRODUCTCATEGORY_PROVIDER,
  PRODUCT_OPTION_PROVIDER,
  PRODUCT_PROVIDER,
  TRANSACTION_EVENT_PROVIDER,
  TRANSACTION_LOG_PROVIDER,
  TRANSACTION_PRODUCT_DETAIL_PROVIDER,
  TRANSACTION_PRODUCT_PROVIDER,
  TRANSACTION_PROVIDER,
  VOUCHER_SETTING_PROVIDER,
  CUSTOMER_BANK_PROVIDER,
} from '@/Helpers/contants';
import { Transaction } from './entities/transaction.entity';
import { ProductOption } from '../product/entities/productOption.entity';
import { Product } from '../product/entities/product.entity';
import { TransactionDetail } from './entities/transactionProductDetail.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Delivery } from '../deliveries/entities/delivery.entity';
import { Discount } from '../discounts/entities/discount.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Notifications } from '../notifications/entities/notifications.entity';
import { TransactionLog } from './entities/transactionPaymentLog.entity';
import { CustomerBank } from '../customer/entities/customerBank entity';
import { ProductCategory } from '../productCategory/entities/productCategory.entity';

export const TransactionsProvider = [
  {
    provide: TRANSACTION_PROVIDER,
    useValue: Transaction,
  },
  {
    provide: TRANSACTION_LOG_PROVIDER,
    useValue: TransactionLog,
  },
  {
    provide: PRODUCT_PROVIDER,
    useValue: Product,
  },
  {
    provide: PRODUCT_OPTION_PROVIDER,
    useValue: ProductOption,
  },
  {
    provide: TRANSACTION_PRODUCT_DETAIL_PROVIDER,
    useValue: TransactionDetail,
  },
  {
    provide: CUSTOMER_PROVIDER,
    useValue: Customer,
  },
  {
    provide: DELIVERY_PROVIDER,
    useValue: Delivery,
  },

  {
    provide: DISCOUNT_PROVIDER,
    useValue: Discount,
  },
  {
    provide: PAYMENT_PROVIDER,
    useValue: Payment,
  },
  {
    provide: NOTIFICATION_PROVIDER,
    useValue: Notifications,
  },
  {
    provide: CUSTOMER_PROVIDER,
    useValue: Customer,
  },

  {
    provide: CUSTOMER_BANK_PROVIDER,
    useValue: CustomerBank,
  },
  {
    provide: PRODUCTCATEGORY_PROVIDER,
    useValue: ProductCategory,
  },
];
