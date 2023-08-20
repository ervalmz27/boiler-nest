import {
  Controller,
  Get,
  Param,
  Res,
  Body,
  Post,
  Put,
  HttpStatus,
  Delete,
  Logger,
  Req,
  Query,
  Render,
} from '@nestjs/common';
import Stripe from 'stripe';
import axios from 'axios';
const CryptoJS = require('crypto-js');
import * as moment from 'moment-timezone';

import { OnlinePaymentsService } from './onlinePayments.service';
import { TransactionsService } from '../transaction/transactions.service';
import { NotificationsService } from '../notifications/notifications.service';
import PaymeUtils from '@/Helpers/paymeUtils';
import { API_BASEURL, PAYME_URL } from '@/Config/url.config';
const { v4: uuid } = require('uuid');

@Controller('online-payments')
export class OnlinePaymentsController {
  private readonly paymeUtils = new PaymeUtils();
  private readonly logger = new Logger(OnlinePaymentsController.name);

  constructor(
    private readonly service: OnlinePaymentsService,
    private readonly transactionService: TransactionsService,
    private readonly notificationService: NotificationsService,
  ) {}

  @Get()
  async findAll(@Query() query: any, @Res() res) {
    const data = await this.service.findAll2(query);

    return res.status(data.length < 1 ? 404 : 200).json({
      data,
      message: data.length < 1 ? 'Data not found' : 'Data found',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const data = await this.service.findById(id);
    if (!data) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ data, message: 'Data not found' });
    }

    return res.status(HttpStatus.OK).json({ data, message: 'Data found' });
  }

  @Post()
  async create(@Body() payload: any, @Res() res) {
    const { type, status } = payload;

    if (status === '1') {
      // mark another payment with same type into inactive
      await this.service.markOthersAsInactive(type);
    }

    const data = await this.service.create(payload);
    return res
      .status(HttpStatus.CREATED)
      .json({ data, message: 'Data created' });
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() payload: any, @Res() res) {
    const { type, status } = payload;

    if (status === '1') {
      // mark another payment with same type into inactive
      await this.service.markOthersAsInactive(type);
    }

    const payment = await this.service.findById(id);
    if (!payment) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ data: payment, message: 'Data not found' });
    }

    const updateData = await this.service.update(id, payload);
    if (updateData[0] > 0) {
      return res
        .status(HttpStatus.OK)
        .json({ data: null, message: 'Data updated' });
    }

    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ data: null, message: 'Data not updated' });
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    const removeData = await this.service.remove(id);
    if (removeData[0] > 0) {
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Data deleted', deletedId: id });
    }

    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'Failed to delete data' });
  }

  @Post('stripe/createIntent')
  async createStripeInten(@Body() payload: any, @Res() res) {
    const { amount, currency, order_id, customer_email } = payload;
    const stripeConfig = await this.service.findStripeConfig();

    if (stripeConfig === null) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'No Stripe Config not found',
      });
    }

    const stripeClient = new Stripe(stripeConfig.secret_key, {
      apiVersion: '2022-11-15',
    });

    const stripeIntentData = await stripeClient.paymentIntents.create({
      amount: amount * 100,
      currency: currency || 'HKD',
      payment_method_types: ['card'],
      receipt_email: customer_email,
      metadata: {
        order_id: order_id,
      },
    });

    if (!stripeIntentData) {
      this.logger.error('Failed Create Payment Info');
      return res.status(HttpStatus.BAD_REQUEST).send({
        data: null,
        message: 'Failed create payment intent',
      });
    }

    await this.transactionService.addIntentToTransaction(
      order_id,
      stripeIntentData.id,
    );

    return res.status(HttpStatus.OK).send({
      data: {
        id: stripeIntentData.id,
        client_secret: stripeIntentData.client_secret,
        currency: stripeIntentData.currency,
      },
      message: 'Payment intent created',
    });
  }

  @Post('stripe/webhook')
  async stripeWebhook(@Req() req, @Body() payload: any, @Res() res) {
    let event = req.body;
    const { secret_key, webhook_secret } =
      await this.service.findStripeConfig();

    const stripeClient = new Stripe(secret_key, {
      apiVersion: '2022-11-15',
    });

    if (webhook_secret) {
      const signature = req.headers['stripe-signature'];
      try {
        event = stripeClient.webhooks.constructEvent(
          req.rawBody,
          signature,
          webhook_secret,
        );
      } catch (err) {
        this.logger.error(
          `⚠️  Webhook signature verification failed.`,
          err.message,
        );
        return res.status(HttpStatus.BAD_REQUEST).send({
          data: null,
          message: 'Verification failed',
        });
      }
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handleSuccessPayment(event.data);
        break;
      case 'payment_intent.failed':
        await this.handlePaymentIntent(event.data, 'FAILED');
        break;
      case 'charge.failed':
        await this.handlePaymentIntent(event.data, 'FAILED');
        break;
      case 'payment_intent.expired':
        await this.handlePaymentIntent(event.data, 'FAILED');
        break;
      case 'charge.expired':
        await this.handlePaymentIntent(event.data, 'FAILED');
        break;
      default:
        this.logger.error(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }

  @Post('paymentasia/return')
  async paymentasiaReturn(@Req() req, @Body() payload, @Res() res) {
    // TODO Log semua request
    this.logger.debug('PAYMENT ASIA DEBUG: ' + JSON.stringify(payload));

    const { request_reference = '', merchant_reference = '', status } = payload;

    let success = false;
    let message = '';
    let paymentStatus = 'PENDING';
    switch (status) {
      case '1':
        this.logger.debug(
          `PA - Payment Success | Request reference ${request_reference}`,
          'Payment | PaymentAsia Return URL',
        );
        paymentStatus = 'PAID';
        success = true;
        message = 'Payment Success';
        break;
      case '2':
        paymentStatus = 'CANCELED';
        this.logger.debug(
          `PA - Payment Rejected | Request reference ${request_reference}`,
          'Payment | PaymentAsia Return URL',
        );
        message = 'Payment Rejected';
        break;
      case '0':
        this.logger.debug(
          `PA - Payment Pending | Request reference ${request_reference}`,
          'Payment | PaymentAsia Return URL',
        );
        message = 'Payment Pending';
        break;
      default:
        paymentStatus = 'CANCELED';
        this.logger.error(
          `PA - Payment Failed | Request reference ${request_reference}`,
          'Payment | PaymentAsia Return URL',
        );
        message = 'Payment Failed';
        break;
    }

    // Update Status
    await this.transactionService.updateStatusByOrderId(
      merchant_reference,
      paymentStatus,
      JSON.stringify(payload),
    );

    if (paymentStatus === 'PAID') {
      //  Send Email Notification
      const trx = await this.transactionService.findOne(merchant_reference);
      const currentTimeFormatted = moment(trx.created_at).format('LLL');

      const mailPayload = {
        email: trx.contact_email,
        orderNumber: trx.order_number,
        orderDate: currentTimeFormatted,
        paymentMethod:
          trx.payment_method === 'STRIPE' ? 'Credit Card' : trx.payment_method,
        // deliveryName: trx.delivery?.name || '',
        deliveryAddress: this.handleDeliveryAddress({
          delivery_address: trx.delivery_address,
          delivery_address2: trx.delivery_address2,
          delivery_address3: trx.delivery_address3,
          delivery_address4: trx.delivery_address4,
          delivery_district: trx.delivery_district,
          delivery_region: trx.delivery_region,
        }),
        // deliveryMethod: trx.delivery?.name || '',
        deliveryEmail: trx.selfpickup_email,
        deliveryPhone: trx.selfpickup_phone,
        productitems: this.castToMailFormat(trx.products),
        totalProduct: trx.subtotal_product,
        totalDiscount: trx.total_discount + trx.total_discount_tier,
        totalDelivery: trx.total_delivery,
        totalGift: 0,
        total: trx.total,
      };
      await this.notificationService.sendOrderConfirmationMail(mailPayload);
    }

    const jsonData = JSON.stringify({
      success: success,
      data: {
        request_reference: request_reference,
        message: message,
      },
    });
    const html = (data, message) => {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="result">
       <h1>${message}</h1>
    </div>
    <script>
	  window.ReactNativeWebView.postMessage(JSON.parse('${data}'));
	</script>
</body>
</html>'`;
    };
    return res.send(html(jsonData, message));
  }

  @Post('paymentasia/callback')
  async paymentasiaCallback(@Req() req, @Body() payload, @Res() res) {
    const {
      amount = 0,
      currency = 'HKD',
      request_reference = '',
      merchant_reference = '',
      status,
      sign,
    } = payload;

    // Cek jika order number exists
    const transactionData = await this.transactionService.findOne(
      merchant_reference,
    );

    if (!transactionData) {
      this.logger.debug(
        `Cannot find transaction with id: ${merchant_reference}`,
        'Payment | PaymentAsia Callback',
      );

      return res.status(HttpStatus.NOT_FOUND).json({
        status: null,
        status_message: 'Transaction ID not found',
        message: 'Failed',
      });
    }

    // Cek status

    let paymentStatus = '';
    let statusMessage = 'failed';
    if (status === '1') {
      paymentStatus = 'PAID';
      statusMessage = 'payment success';
    } else if (status === '2') {
      paymentStatus = 'REJECTED';
      statusMessage = 'payment rejected';
    } else if (status === '0') {
      paymentStatus = 'PENDING';
      statusMessage = 'payment pending';
    } else {
      paymentStatus = 'FAILED';
      statusMessage = 'failed';
    }
    // update payment status
    // kirim email
    //
  }

  // Mobile - Create Payme Intent
  @Post('payme/createIntent')
  async createPaymeIntent(@Req() req, @Body() payload, @Res() res) {
    try {
      // Check current config
      const paymeConfig = await this.service.findPaymeConfig();
      if (paymeConfig === null) {
        return res
          .status(404)
          .json({ data: null, message: 'No Payme config found' });
      }

      console.log(paymeConfig);
      const paymeSigningKeyId = paymeConfig.signing_key_id;
      const paymeSigningKey = paymeConfig.signing_key;

      const { accessToken } = await this.generateToken(
        paymeConfig.client_id,
        paymeConfig.secret_key,
      );
      const { totalAmount, orderId } = req.body;

      const WEBHOOK_URL = API_BASEURL + `/webhook/payme/${orderId}`;
      const URL_CALLBACK_SUCCESS =
        API_BASEURL + `/payme/return/${orderId}/success`;
      const URL_CALLBACK_ERROR = API_BASEURL + `payme/return/${orderId}/failed`;

      const payload = {
        totalAmount,
        currencyCode: 'HKD',
        effectiveDuration: 120,
        notificationUri: WEBHOOK_URL,
        appSuccessCallback: URL_CALLBACK_SUCCESS,
        appFailCallback: URL_CALLBACK_ERROR,
        merchantData: {
          orderId,
        },
      };

      const method = 'post';
      const targetUrl = '/payments/paymentrequests';
      const requestURL = PAYME_URL + targetUrl;

      const computedDigest = this.paymeUtils.createComputedDigest(payload);
      const headerHash = this.paymeUtils.createHeaderHash(
        method,
        targetUrl,
        accessToken,
        computedDigest,
      );

      const configRequest = this.paymeUtils.createConfigRequest(
        headerHash,
        paymeSigningKeyId,
        paymeSigningKey,
      );
      const signature = this.paymeUtils.computeHttpSignature(
        configRequest,
        headerHash,
      );

      const headers = this.paymeUtils.createHeadersRequest(
        accessToken,
        headerHash,
        signature,
        computedDigest,
      );

      const response = await axios.post(requestURL, payload, {
        headers: headers,
      });

      const responseData = response.data;

      this.logger.log(
        `Create payment Request:  ${JSON.stringify(responseData)}`,
      );

      const paymentRequestId = responseData.paymentRequestId;
      const receiptUrl = responseData.webLink;

      const finalResponse = {
        payment_confirmed: false,
        id: paymentRequestId,
        type: 'payment_intent',
        data: responseData,
        client_secret: signature,
        receipt_url: receiptUrl,
      };

      return res.status(HttpStatus.CREATED).json({
        data: finalResponse,
      });
    } catch (error) {
      this.logger.error('Errro on create payment ' + error.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: error.message,
      });
    }
  }

  // Check Payme Status
  @Post('payme/getPaymentRequest')
  async getPaymentRequest(@Req() req, @Body() payload, @Res() res) {
    const paymentRequestId = payload.paymentRequestId;

    try {
      const paymeConfig = await this.service.findPaymeConfig();
      if (paymeConfig === null) {
        return res
          .status(404)
          .json({ data: null, message: 'No Payme config found' });
      }

      const { accessToken } = await this.generateToken(
        paymeConfig.client_id,
        paymeConfig.secret_key,
      );

      const PAYME_URL = 'https://sandbox.api.payme.hsbc.com.hk';
      const PAYME_API_VERSION = '0.12';

      const traceId = uuid();

      const payload = {};
      const method = 'get';
      const targetUrl = `/payments/paymentrequests/${paymentRequestId}`;

      const computedDigest = this.paymeUtils.createComputedDigest(payload);

      const currentTime = moment().tz('Asia/Hong_Kong').format();
      const headerHash = {
        '(request-target)': `${method} ${targetUrl}`,
        'Request-Date-Time': currentTime,
        'Api-Version': PAYME_API_VERSION,
        'Trace-Id': traceId,
        Authorization: `Bearer ${accessToken}`,
        Digest: computedDigest,
      };

      const configRequest = {
        algorithm: 'hmac-sha256',
        keyId: paymeConfig.signing_key_id,
        secretkey: CryptoJS.enc.Base64.parse(paymeConfig.signing_key),
        headers: Object.keys(headerHash),
      };

      const signature = this.paymeUtils.computeHttpSignature(
        configRequest,
        headerHash,
      );
      const requestURL = PAYME_URL + targetUrl;

      const response = await axios.get(requestURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': 'en-US',
          'Trace-Id': headerHash['Trace-Id'],
          'Request-Date-Time': headerHash['Request-Date-Time'],
          'Api-Version': headerHash['Api-Version'],
          Signature: signature,
          Digest: computedDigest,
        },
      });

      console.log(response);

      req.log.info('check payment request status:: ', response.data);
      return res.status(200).json({
        data: response.data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ data: null, message: error.message });
    }
  }

  @Post('payme/webhook/:order_id')
  async handlePaymeWebhook(
    @Param('order_id') order_id: string,
    @Req() req,
    @Body() payload,
    @Res() res,
  ) {
    this.logger.log(`Payme Webhook + ${JSON.stringify(req.body)}`);
    this.logger.log(`Order ID` + order_id);

    const { body, headers } = req;
    const eventType = headers['x-event-type'];

    const PaymentRequestStatus = {
      ACTIVE: 'PR001',
      EXPIRED: 'PR007',
      ABORTED: 'PR004',
      COMPLETED: 'PR005',
    };
    this.logger.log(
      'PAYME - webhookNotificationHandler eventType:: ' + eventType,
    );
    this.logger.log(
      'PAYME - webhookNotificationHandler body:: ' + JSON.stringify(body),
    );
    this.logger.log(
      'PAYME - webhookNotificationHandler headers:: ' + JSON.stringify(headers),
    );

    let paymentRequestId;
    let statusCode = body.statusCode;

    switch (eventType) {
      case 'payment.success':
        paymentRequestId = body.transactions[0].orderId;
        break;
      case 'payment.failure':
        paymentRequestId = body.orderId;
        statusCode = PaymentRequestStatus.ABORTED;
        break;
      default:
        this.logger.error(`PAYME - Unhandled event type ${eventType}`);
    }

    this.logger.log('PAYME - PaymentRequestId : ' + paymentRequestId);

    let status = 'PENDING';
    switch (statusCode) {
      case PaymentRequestStatus.EXPIRED:
        req.log.info(`Payment request ${paymentRequestId} is EXPIRED`);
        status = 'EXPIRED';
        break;
      case PaymentRequestStatus.ABORTED:
        req.log.info(`Payment request ${paymentRequestId} is ABORTED`);
        status = 'ABORTED';
        break;
      case PaymentRequestStatus.COMPLETED:
        req.log.info(`Payment request ${paymentRequestId} is COMPLETED`);
        status = 'COMPLETED';
        break;
      default:
        req.log.info('Payment request is not executed');
    }

    this.logger.log('PAYME - Status : ' + status);

    if (status !== 'PENDING') {
    }

    if (status !== 'PENDING' && statusCode === PaymentRequestStatus.COMPLETED) {
      req.log.info(
        `Payment request ${paymentRequestId} is updating on delivery status to order processing`,
      );
      await this.paymeHandleSuccessPayment(order_id, paymentRequestId);
    }

    return res.status(200).json({
      data: '',
      message: 'Webhook handled',
    });
  }

  // Handle redirect success & error from mobile app
  @Get('/payme/return/:order_id/:status')
  async handleSuccessRoute(@Param() params: any, @Res() res) {
    const { order_id, status } = params;
    const mobileAppConfig = {
      deepLink: 'com.yoyokitchen.marketplace://',
      screen: {
        orderHistory: 'drawers/maintab/profile/order-history',
      },
    };

    const transactionData = await this.transactionService.findById(order_id);

    if (transactionData === null) {
      this.logger.error('Payme - Return URL -  Transaction Data not found');
      return res.render('payment/notfound');
    }

    return res.render('payment/index', {
      pageTitle: `Payment Order No: ${transactionData.id}`,
      appName: 'Yoyokitchen',
      status: status === 'success' ? 'Success' : 'Failed',
      autoclose: true,
      deepLink: mobileAppConfig.deepLink + mobileAppConfig.screen.orderHistory,
      transaction_id: transactionData.id,
      payment_method: transactionData.payment_method,
      total: transactionData.total,
      created_at: transactionData.created_at,
    });
  }

  async handleSuccessPayment(paymentIntent) {
    const updateResult =
      await this.transactionService.updateStripePaymentAsSuccess({
        order_id: paymentIntent.object.metadata?.order_id,
        detail: paymentIntent,
      });

    if (updateResult[0] < 1) {
      this.logger.error(
        `Failed update payment status into ${status} with payment intent : ${JSON.stringify(
          paymentIntent,
        )}`,
      );
    }

    //  Send Email Notification
    const trx = await this.transactionService.findOne(
      paymentIntent.object.metadata?.order_id,
    );
    const currentTimeFormatted = moment(trx.created_at).format('LLL');

    const mailPayload = {
      email: trx.contact_email,
      orderNumber: trx.order_number,
      orderDate: currentTimeFormatted,
      paymentMethod:
        trx.payment_method === 'STRIPE' ? 'Credit Card' : trx.payment_method,

      deliveryAddress: this.handleDeliveryAddress({
        delivery_address: trx.delivery_address,
        delivery_address2: trx.delivery_address2,
        delivery_address3: trx.delivery_address3,
        delivery_address4: trx.delivery_address4,
        delivery_district: trx.delivery_district,
        delivery_region: trx.delivery_region,
      }),

      deliveryEmail: trx.selfpickup_email,
      deliveryPhone: trx.selfpickup_phone,
      productitems: this.castToMailFormat(trx.products),
      totalProduct: trx.subtotal_product,
      totalDiscount: trx.total_discount + trx.total_discount_tier,
      totalDelivery: trx.total_delivery,
      totalGift: 0,
      total: trx.total,
    };
    await this.notificationService.sendOrderConfirmationMail(mailPayload);
  }

  async paymeHandleSuccessPayment(orderId, paymentRequestId) {
    const updateResult =
      await this.transactionService.updatePaymePaymentAsSuccess({
        order_id: orderId,
        payment_detail: paymentRequestId,
      });

    if (updateResult[0] < 1) {
      this.logger.error(
        `Failed update payment status into success with payment detail `,
      );
    }

    //  Send Email Notification
    const trx = await this.transactionService.findOne(orderId);
    const currentTimeFormatted = moment(trx.created_at).format('LLL');

    const mailPayload = {
      email: trx.contact_email,
      orderNumber: trx.order_number,
      orderDate: currentTimeFormatted,
      paymentMethod:
        trx.payment_method === 'STRIPE' ? 'Credit Card' : trx.payment_method,
      // deliveryName: trx.delivery?.name || '',
      deliveryAddress: this.handleDeliveryAddress({
        delivery_address: trx.delivery_address,
        delivery_address2: trx.delivery_address2,
        delivery_address3: trx.delivery_address3,
        delivery_address4: trx.delivery_address4,
        delivery_district: trx.delivery_district,
        delivery_region: trx.delivery_region,
      }),
      // deliveryMethod: trx.delivery?.name || '',
      deliveryEmail: trx.selfpickup_email,
      deliveryPhone: trx.selfpickup_phone,
      productitems: this.castToMailFormat(trx.products),
      totalProduct: trx.subtotal_product,
      totalDiscount: trx.total_discount + trx.total_discount_tier,
      totalDelivery: trx.total_delivery,
      totalGift: 0,
      total: trx.total,
    };
    await this.notificationService.sendOrderConfirmationMail(mailPayload);
  }

  castToMailFormat(detail) {
    let productmaildata = [];
    detail.forEach((e) => {
      let subtotal = e.qty * e.price;
      productmaildata.push({
        name: e.product?.name,
        qty: e.qty,
        price: e.price,
        subtotal: subtotal,
        totalprice: subtotal,
      });
    });
    return productmaildata;
  }

  handleDeliveryAddress({
    delivery_address,
    delivery_address2,
    delivery_address3,
    delivery_address4,
    delivery_district,
    delivery_region,
  }) {
    let completeAddress = delivery_address;
    if (delivery_address2 !== null && delivery_address2 !== '') {
      completeAddress += ', ' + delivery_address2;
    }
    if (delivery_address3 !== null && delivery_address3 !== '') {
      completeAddress += ', ' + delivery_address3;
    }
    if (delivery_address4 !== null && delivery_address4 !== '') {
      completeAddress += ', ' + delivery_address4;
    }
    if (delivery_district !== null && delivery_district !== '') {
      completeAddress += ', ' + delivery_district;
    }
    if (delivery_region !== null && delivery_region !== '') {
      completeAddress += ', ' + delivery_region;
    }

    return completeAddress;
  }

  async handlePaymentIntent(paymentIntent, status) {
    const updateResult = await this.transactionService.updateStatusByOrderId(
      paymentIntent.object.metadata?.order_id,
      status,
      paymentIntent.object,
    );

    if (updateResult[0] < 1) {
      this.logger.error(
        `Failed update payment status into ${status} with payment intent : ${JSON.stringify(
          paymentIntent,
        )}`,
      );
    }
  }

  async generateToken(clientId, clientSecret) {
    try {
      // const PAYME_CLIENT_ID = 'f4f50ba0-f375-4ff4-ba04-824db5be8a4a';
      // const PAYME_CLIENT_SECRET = 'rOa8Q~pK~GPd4opkLl2iUBHNR5k3m8wzI1REzdy0';
      const PAYME_URL = 'https://sandbox.api.payme.hsbc.com.hk';
      const PAYME_API_VERSION = '0.12';
      const requestURL = PAYME_URL + `/oauth2/token`;
      const body = {
        client_id: clientId,
        client_secret: clientSecret,
      };

      const {
        data: { accessToken, expiresOn, tokenType },
      } = await axios.post(requestURL, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'Api-Version': PAYME_API_VERSION,
        },
      });

      return {
        accessToken,
        expiresOn,
        tokenType,
      };
    } catch (error) {
      throw Error(error);
    }
  }
}
