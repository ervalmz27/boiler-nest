import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Res,
  Body,
  Post,
  Put,
  Req,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import Helpers from '@/Helpers/helpers';

import { RESPONSES } from '@/Helpers/contants';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  DELIVERY_STATUS,
} from '@/Helpers/contants/status';
import { ProductOptionsService } from '../product/productOptions.service';
import { TransactionProductDetailsService } from './transactionProductDetail.service';
import { TransactionsService } from './transactions.service';

import { XAuthGuards } from '../auth/xauth.guard';
import { TransactionLogServices } from './services/transactionLog.service';
// import { TEMPLATE_ID } from '@/Helpers/contants/sengridtemplate';

@Controller('transactions')
export class TransactionsController {
  private readonly helpers = new Helpers();
  constructor(
    private readonly service: TransactionsService,
    private readonly logService: TransactionLogServices,
    private readonly productOptionService: ProductOptionsService,
    private readonly trxProductDetailService: TransactionProductDetailsService,
  ) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const payload = req.query;

    const data = await this.service.findAll(payload);

    if (data === null) return res.status(404).json({ data });

    return res.status(200).json({ data });
  }

  @Post('findAllWithCriteria')
  async findAllWithCriteria(@Res() res, @Req() req) {
    const payload = req.query;

    const user = await this.service.findAllWithCriteria(payload);
    if (user.length < 1) {
      return res.status(HttpStatus.NOT_FOUND).json({
        data: [],
        message: 'Transaction not found.',
      });
    }

    return res.status(HttpStatus.OK).json({
      data: [],
      message: 'Transaction found',
    });
  }

  @UseGuards(XAuthGuards)
  @Post('/getUserTransaction')
  async getUserTransaction(@Request() req, @Query() query, @Res() res) {
    const { id } = req.user;
    const { q, status } = query;
    const newPayload = {
      q,
      status,
      customer_id: id,
    };

    const transactions = await this.service.findUserTransaction(newPayload);
    if (transactions.length < 1) {
      return res.status(HttpStatus.NOT_FOUND).send({
        data: transactions,
        message: 'Transaction not found',
      });
    }

    return res.status(HttpStatus.OK).send({
      data: transactions,
      message: 'Transaction Found',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const data = await this.service.findOne(id);
    if (data === null) {
      return res
        .status(404)
        .response({ data: null, message: 'Data not found' });
    }

    return res.status(200).json({ data, message: 'Data found' });
  }

  @Post('getPaymentLog/:id')
  async getPaymentLog(@Param('id') id: string, @Res() res) {
    const data = await this.logService.getPaymentLog(id);
    if (data === null) {
      return res
        .status(404)
        .response({ data: null, message: 'Data not found' });
    }

    return res.status(200).json({ data, message: 'Data found' });
  }

  @Post('getDeliveryLog/:id')
  async getDeliveryLog(@Param('id') id: string, @Res() res) {
    const data = await this.logService.getDeliveryLog(id);
    if (data === null) {
      return res
        .status(404)
        .response({ data: null, message: 'Data not found' });
    }

    return res.status(200).json({ data, message: 'Data found' });
  }

  // @UseGuards(XAuthGuards)
  // @Post()
  // async create(@Request() req, @Body() payload: any, @Res() res) {
  //   this.logger.log('Transaction Payload ' + JSON.stringify(payload));
  //   const { id, name, email, phone } = req.user;
  //   let total = 0;
  //   let subtotalProduct = 0;
  //   let totalDiscount = 0;
  //   let totalDelivery = 0;

  //   let shippingPrice = 0;
  //   let deliveryDetail = {
  //     name: null,
  //     method: null,
  //   };
  //   if (payload.delivery_option_id && payload.delivery_option_id !== null) {
  //     const deliveryData = await this.handleDeliveryData(payload);
  //     if (!deliveryData) {
  //       return res.status(HttpStatus.BAD_REQUEST).json({
  //         success: false,
  //         data: null,
  //         message: 'Delivery option not found',
  //       });
  //     }
  //     shippingPrice = deliveryData.price;
  //     deliveryDetail['name'] = deliveryData.name || null;
  //     deliveryDetail['method'] = deliveryData.name || null;
  //   }

  //   totalDelivery = shippingPrice;

  //   let paymentMethodName = payload.payment_method;
  //   if (payload.payment_method === 'CUSTOM') {
  //     const paymentData = await this.handlePaymentData(payload);

  //     if (!paymentData) {
  //       return res.status(HttpStatus.BAD_REQUEST).json({
  //         success: false,
  //         data: null,
  //         message: 'Custom payment method not found',
  //       });
  //     }
  //     paymentMethodName = paymentData.name;
  //   }

  //   let couponDiscount = 0;
  //   let couponData = {};

  //   total = subtotalProduct + subtotalEvent + totalDelivery;
  //   total = total - totalDiscount - totalDiscountTier - totalDiscountCode;

  //   let generatedOrderNumber = null;

  //   if (payload.payment_method === 'CUSTOM') {
  //     generatedOrderNumber = await this.service.generateOrderNumber();
  //   }

  //   const currentTime = moment().tz('Asia/Hong_Kong').format();
  //   const currentTimeFormatted = moment().tz('Asia/Hong_Kong').format('LLL');

  //   const newPayload = {
  //     customer_id: id,
  //     order_number: generatedOrderNumber,
  //     contact_firstname: name,
  //     contact_lastname: '',
  //     contact_email: email,
  //     contact_phone: phone,
  //     remarks: payload.remaks || null,

  //     payment_option_id: payload.payment_option_id || null,
  //     payment_method: payload.payment_method,
  //     payment_identity_id: payload.payment_identity_id || null,
  //     payment_detail: payload.payment_detail || null,
  //     payment_status: this.validatePaymentStatus(payload.payment_status),

  //     member_coupon_id: payload.member_coupon_id || null,
  //     coupon_id: payload.coupon_id || null,
  //     coupon_discount: couponDiscount || 0,
  //     coupon_detail: JSON.stringify(couponData),

  //     delivery_option_id: payload.delivery_option_id || null,
  //     delivery_fee: totalDelivery,
  //     delivery_address: payload.delivery_address || null,
  //     delivery_address2: payload.delivery_address2 || null,
  //     delivery_address3: payload.delivery_address3 || null,
  //     delivery_address4: payload.delivery_address4 || null,
  //     delivery_district: payload.delivery_district || null,
  //     delivery_region: payload.delivery_region || null,
  //     selfpickup_name: payload.selfpickup_data?.name || null,
  //     selfpickup_phone: payload.selfpickup_data?.contact || null,
  //     selfpickup_email: payload.selfpickup_data?.email || null,

  //     // items: products.detail,
  //     // eventItems: events.detail,
  //     status: payload.payment_status || 'PENDING',

  //     payer_answers: this.handlePayerAnswer(payload),

  //     total_discount_code: totalDiscountCode,
  //     total_discount_tier: totalDiscountTier,

  //     subtotal_product: subtotalProduct,
  //     subtotal_event: subtotalEvent,
  //     total_discount: totalDiscount,
  //     total_delivery: totalDelivery,
  //     total: total,
  //     created_at: currentTime,
  //   };

  //   if (typeof payload.discount_code !== 'undefined') {
  //     newPayload['discount_code'] = payload.discount_code;
  //     const discountData = await this.discountService.findOne2(
  //       {
  //         code: payload.discount_code,
  //       },
  //       true,
  //     );
  //     if (discountData !== null) {
  //       newPayload['discount_id'] = discountData.id;
  //       newPayload['discount_detail'] = JSON.stringify(discountData);
  //     }
  //   }

  //   try {
  //     const trx = await this.service.create(newPayload);
  //     const compiledDeliveryAddress = this.handleDeliveryAddress(newPayload);
  //     // await this.trxProductDetailService.create(trx.id, newPayload.items);
  //     // await this.transactionEventService.create(trx.id, newPayload.eventItems);

  //     if (payload.payment_method === 'CUSTOM') {
  //       const mailPayload = {
  //         email: email,
  //         customerName: name,
  //         orderNumber: generatedOrderNumber,
  //         orderDate: currentTimeFormatted,
  //         paymentMethod:
  //           paymentMethodName === 'STRIPE' ? 'Credit Card' : paymentMethodName,
  //         deliveryName: deliveryDetail.name || '',
  //         deliveryAddress: compiledDeliveryAddress,
  //         deliveryMethod: deliveryDetail.name || '',
  //         deliveryEmail: email,
  //         deliveryPhone: phone,
  //         // productitems: this.castToMailFormat(products.detail),
  //         totalProduct: subtotalProduct,
  //         totalDiscount: totalDiscount + parseFloat(totalDiscountTier),
  //         totalDelivery: totalDelivery,
  //         totalGift: 0,
  //         total: total,
  //       };
  //       await this.notificationService.sendAwaitingPaymentMail(mailPayload);
  //     }

  //     // Mark coupon as claimed

  //     //  Deduct Stock
  //     await this.productOptionService.deductStock(payload.items);

  //     // Check availability stock and send email owner if stock under limit
  //     await this.checkProductAvailability(payload.items);

  //     return res.status(HttpStatus.OK).json({
  //       success: true,
  //       data: { transactionId: trx.id },
  //       message: 'Transaction Created',
  //     });
  //   } catch (error) {
  //     this.logger.error(`Error submit transaction + ${error.message}`);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       success: false,
  //       data: null,
  //       message: `Error submit transaction ${error.message}`,
  //     });
  //   }
  // }

  @Post()
  async create(@Body() payload, @Res() res) {
    let subtotal = 0;
    const discount = payload.discount;

    const validOption = await this.productOptionService.validateProductOption(
      payload.items,
    );
    subtotal = validOption.total;

    const transaction = await this.service.create({
      order_number: this.helpers.generateOrderNumber(),
      order_date: payload.order_date,
      customer_id: payload.customer_id,
      delivery_cost: parseInt(payload.delivery_cost) || 0,
      delivery_method: payload.delivery_method,
      subtotal: subtotal,
      total_discount: payload.discount,
      total: subtotal - discount,
      payment_status: PAYMENT_STATUS.PENDING,
      status: ORDER_STATUS.IN_PROGRESS,
      delivery_status: DELIVERY_STATUS.PENDING,
    });
    await this.trxProductDetailService.create(
      transaction.id,
      validOption.detail,
    );

    await this.storeLog(transaction.id);
    return res
      .status(200)
      .json({ data: transaction.id, message: 'Transaction Submitted' });
  }

  async storeLog(id) {
    this.logService.create(
      id,
      'payment',
      'Transaction Initiated, DELIVERY status set to ' + PAYMENT_STATUS.PENDING,
    );
    this.logService.create(
      id,
      'delivery',
      'Transaction Initiated, DELIVERY status set to ' +
        DELIVERY_STATUS.PENDING,
    );
  }

  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() payload: UpdateTransactionDto,
  //   @Res() res,
  // ) {
  //   const PAYMENT = await this.service.findOne(id);
  //   if (PAYMENT === null) {
  //     return this.helpers.response(
  //       res,
  //       HttpStatus.NOT_FOUND,
  //       RESPONSES.DATA_NOTFOUND,
  //       PAYMENT,
  //     );
  //   }

  //   if (typeof payload.password !== 'undefined') {
  //     payload.password = await bcrypt.hash(payload.password, 10);
  //   }
  //   const updateTransaction = await this.service.update(+id, payload);

  //   return this.helpers.response(
  //     res,
  //     HttpStatus.OK,
  //     RESPONSES.DATA_UPDATED,
  //     updateTransaction,
  //   );
  // }

  @Put('updateTransactionStatus')
  async updateTransactionStatus(@Body() payload: any, @Res() res) {
    const { transaction_id, status } = payload;
    const transaction = await this.service.findOne(transaction_id);
    if (transaction === null)
      return res.status(404).json({ data: null, message: 'Data not found' });

    await this.service.updateTransactionStatus(transaction_id, status);
    return res
      .status(200)
      .json({ data: null, message: 'transaction status updated' });
  }

  @Put('updatePaymentStatus')
  async updatePaymentStatus(@Body() payload: any, @Res() res) {
    const { transaction_id, payment_status } = payload;
    const transaction = await this.service.findOne(transaction_id);

    if (transaction === null) return res.status(404).json({ data: null });

    await this.service.updatePaymentStatus(transaction_id, payment_status);

    return res
      .status(200)
      .json({ data: null, message: 'payment status updated' });
  }

  @Put('updateDeliveryStatus')
  async updateDeliveryStatus(@Body() payload: any, @Res() res) {
    const { transaction_id, delivery_status } = payload;

    const transaction = await this.service.findOne(transaction_id);
    if (transaction === null)
      return res
        .status(404)
        .json({ data: transaction, message: 'Data not found' });

    await this.service.updateDeliveryStatus(transaction_id, delivery_status);
    return res
      .status(200)
      .json({ data: null, message: 'payment status updated' });
  }

  // @Put(':id/updateDeliveryRemark')
  // async updateDeliveryRemark(
  //   @Param('id') id: string,
  //   @Body() payload: any,
  //   @Res() res,
  // ) {
  //   const transaction = await this.service.findOne(id);
  //   if (transaction === null) {
  //     return this.helpers.response(
  //       res,
  //       HttpStatus.NOT_FOUND,
  //       RESPONSES.DATA_NOTFOUND,
  //       transaction,
  //     );
  //   }

  //   await this.service.updateDeliveryRemark(id, payload);
  //   return this.helpers.response(
  //     res,
  //     HttpStatus.OK,
  //     RESPONSES.DATA_UPDATED,
  //     null,
  //   );
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: number, @Res() res) {
  //   const removeData = await this.service.remove(+id);
  //   if (removeData > 0) {
  //     return this.helpers.response(res, HttpStatus.OK, RESPONSES.DATA_DELETED, {
  //       deletedId: id,
  //     });
  //   }

  //   return this.helpers.response(
  //     res,
  //     HttpStatus.BAD_REQUEST,
  //     RESPONSES.FAIL_DELETED,
  //     null,
  //   );
  // }

  // async handlePaymentData({ payment_option_id }) {
  //   // Handle if payment method is custom
  //   if (typeof payment_option_id !== 'undefined') {
  //     const paymentData = await this.customPaymentService.findById(
  //       payment_option_id,
  //     );
  //     if (!paymentData) return false;
  //     return paymentData;
  //   }
  // }

  // async handleDeliveryData({ delivery_option_id }) {
  //   if (delivery_option_id) {
  //     const deliveryData = await this.deliveryService.findById(
  //       delivery_option_id,
  //     );
  //     if (deliveryData === null) {
  //       return false;
  //     }

  //     return deliveryData;
  //   }
  // }

  // validatePaymentStatus(paymentStatus) {
  //   const validStatus = ['PENDING', 'PAID', 'CANCELD', 'REFUNDED'];
  //   if (!validStatus.includes(paymentStatus)) return 'PENDING';
  //   return paymentStatus;
  // }

  // handleDeliveryAddress({
  //   delivery_address,
  //   delivery_address2,
  //   delivery_address3,
  //   delivery_address4,
  //   delivery_district,
  //   delivery_region,
  // }) {
  //   let completeAddress = delivery_address;
  //   if (delivery_address2 !== null && delivery_address2 !== '') {
  //     completeAddress += ', ' + delivery_address2;
  //   }
  //   if (delivery_address3 !== null && delivery_address3 !== '') {
  //     completeAddress += ', ' + delivery_address3;
  //   }
  //   if (delivery_address4 !== null && delivery_address4 !== '') {
  //     completeAddress += ', ' + delivery_address4;
  //   }
  //   if (delivery_district !== null && delivery_district !== '') {
  //     completeAddress += ', ' + delivery_district;
  //   }
  //   if (delivery_region !== null && delivery_region !== '') {
  //     completeAddress += ', ' + delivery_region;
  //   }

  //   return completeAddress;
  // }

  // castToMailFormat(items) {
  //   let productmaildata = [];
  //   items.forEach((e) => {
  //     let subtotal = e.qty * e.price;
  //     productmaildata.push({
  //       name: e.product_name,
  //       qty: e.qty,
  //       price: e.price,
  //       subtotal: subtotal,
  //       totalprice: subtotal,
  //     });
  //   });
  //   return productmaildata;
  // }

  // handleSendMail() {}

  // @Post('getMonthly')
  // async getMonthlyReport(@Query() q, @Res() res) {
  //   const { month, year } = q;

  //   const trx = await this.service.findByMonthAndYear(month, year);

  //   let data = [];
  //   let category = [];

  //   for (let index = 1; index < 31; index++) {
  //     let dt = 0;

  //     trx.forEach((e) => {
  //       const date = moment(e.created_at).format('D');
  //       if (index === parseInt(date)) {
  //         dt += Math.ceil(e.total);
  //       }
  //     });
  //     data.push(dt);
  //     category.push(index + '/' + month);
  //   }
  //   return res.send({
  //     data,
  //     category,
  //   });
  // }

  // @Post('getDiscountUsage')
  // async getDiscountUsage(@Body() payload, @Res() res) {
  //   const { discount_id } = payload;
  //   const transactionDiscount = await this.service.findDiscountFromTransaction(
  //     discount_id,
  //   );

  //   if (!transactionDiscount || transactionDiscount.length < 1) {
  //     return res.status(HttpStatus.NOT_FOUND).send({
  //       data: [],
  //       message: 'Discount not Found',
  //     });
  //   }

  //   return res.status(HttpStatus.OK).send({
  //     data: transactionDiscount,
  //     message: 'Discount Found',
  //   });
  // }

  // @Post('getTransactionByCoupon')
  // async getTransactionByCoupon(@Body() payload, @Res() res) {
  //   const { coupon_id } = payload;
  //   const transaction = await this.service.findByCoupon(coupon_id);
  //   transaction.map((e) => {
  //     e.coupon_detail =
  //       e.coupon_detail !== null ? JSON.parse(e.coupon_detail) : {};
  //   });
  //   return res.status(HttpStatus.OK).json({
  //     data: transaction,
  //   });
  // }

  // async checkProductAvailability(items) {
  //   const limitedProduct = await this.productOptionService.checkStockUnderLimit(
  //     items,
  //   );
  //   for (const product of limitedProduct) {
  //     let sendEmail = await this.notificationService.sendEmail({
  //       service_sender: 'PRODUCT STOCK_LIMIT_NOTIFICATION',
  //       destination: 'jessiefoo@gobuddy.asia',
  //       templateId: TEMPLATE_ID.STOCK_REMINDER,
  //       templatePayload: {
  //         product_name:
  //           product.product_name + ' ' + product.product_option_name,
  //       },
  //     });
  //   }
  // }

  // handlePayerAnswer({ payer_answers }) {
  //   try {
  //     if (typeof payer_answers !== 'undefined') {
  //       return JSON.stringify(payer_answers);
  //     }
  //     return JSON.stringify([]);
  //   } catch (error) {
  //     return JSON.stringify([]);
  //   }
  // }
}
