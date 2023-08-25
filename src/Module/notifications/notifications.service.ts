import { Inject, Injectable, Logger } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import axios from 'axios';
import { NOTIFICATION_PROVIDER } from '@/Helpers/contants';
import { Notifications } from './entities/notifications.entity';
import mailConfig from '@/Config/email.config';
// import { TEMPLATE_ID } from '@/Helpers/contants/sengridtemplate';
const SENDER_MAIL = mailConfig.email_sender;
const MAIL_CC = mailConfig.email_cc;
const MAIL_BCC = mailConfig.email_bcc;
sendgrid.setApiKey(
  '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',
);

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(NOTIFICATION_PROVIDER)
    private readonly repository: typeof Notifications,
  ) {}

  async findAll() {
    return await this.repository.findAll({});
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      raw: true,
    });
  }

  async create(payload: any) {
    return await this.repository.create({ ...payload });
  }

  async update(id: number, payload) {
    return await this.repository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }

  async sendEmail(payload: any) {
    const sendgridPayload = {
      to: payload.destination,
      from: SENDER_MAIL,
      templateId: payload.templateId,
      dynamic_template_data: payload.templatePayload,
      bcc: MAIL_BCC,
      cc: MAIL_CC,
    };

    const sendmail = await sendgrid
      .send(sendgridPayload)
      .then((response) => {
        this.logger.debug(
          `Send email SUCCESS | Status Code: ${response[0].statusCode}`,
        );
        return {
          success: true,
          statusCode: response[0].statusCode,
          response: JSON.stringify(response[0]),
        };
      })
      .catch((error) => {
        this.logger.error(
          `Send email FAILED | Status Code: ${error.response.body}`,
        );
        return {
          success: false,
          statusCode: error.response.code || 500,
          response: JSON.stringify(error.response.body),
        };
      });

    return {
      payload: sendgridPayload,
      response: sendmail.response,
      statusCode: sendmail.statusCode,
      isSuccess: sendmail.success,
    };
  }

  async sendOrderConfirmationMail(payload) {
    const {
      email,
      orderNumber,
      orderDate,
      paymentMethod,
      deliveryName,
      deliveryAddress,
      deliveryMethod,
      deliveryPhone,
      productitems,
      totalProduct,
      totalDiscount,
      totalDelivery,
      totalGift,
      total,
    } = payload;

    await this.sendEmail({
      destination: email,
      // templateId: TEMPLATE_ID.ORDER_CONFIRMATION,
      templatePayload: {
        Order_No: orderNumber,
        Order_Date: orderDate,
        order_payment_method: paymentMethod,
        delivery_name: deliveryName,
        delivery_address: deliveryAddress,
        delivery_method: deliveryMethod,
        delivery_phone: deliveryPhone,
        order_item: productitems,
        order_subtotal: totalProduct,
        order_discount: totalDiscount,
        order_delivery: totalDelivery,
        gift_redemption: totalGift,
        order_total: total,
      },
    });
  }

  async sendAwaitingPaymentMail(payload) {
    const {
      email,
      customerName,
      orderNumber,
      orderDate,
      paymentMethod,
      deliveryName,
      deliveryAddress,
      deliveryMethod,
      deliveryPhone,
      deliveryEmail,
      productitems,
      totalProduct,
      totalDiscount,
      totalDelivery,
      totalGift,
      total,
    } = payload;
    await this.sendEmail({
      destination: email,
      templateId: 'd-d15dcd27dcba4cc3872bd82aff8aaf7a',
      templatePayload: {
        Customer_Name: customerName,
        Order_No: orderNumber,
        Order_Date: orderDate,
        order_payment_method: paymentMethod,
        delivery_name: deliveryName,
        delivery_email: deliveryEmail,
        delivery_address: deliveryAddress,
        delivery_method: deliveryMethod,
        delivery_phone: deliveryPhone,
        order_item: productitems,
        order_subtotal: totalProduct,
        order_discount: totalDiscount,
        order_delivery_fee: totalDelivery,
        gift_redemption: totalGift,
        order_total: total,
      },
    });
  }

  async sendOrderShippedMail(payload) {
    const {
      email,
      customerName,
      shippingMessage,
      orderNumber,
      orderDate,
      paymentMethod,
      deliveryName,
      deliveryAddress,
      deliveryDescription,
      deliveryMethod,
      deliveryPhone,
      deliveryEmail,
      productitems,
    } = payload;
    await this.sendEmail({
      destination: email,
      // templateId: TEMPLATE_ID.SHIPING_STATUS_UPDATE,
      templatePayload: {
        Order_No: orderNumber,
        Customer_Name: customerName,
        shipping_message: shippingMessage,
        Order_Date: orderDate,
        order_payment_method: paymentMethod,
        delivery_name: deliveryName,
        delivery_email: deliveryEmail,
        delivery_address: deliveryAddress,
        delivery_description: deliveryDescription,
        delivery_method: deliveryMethod,
        order_item: productitems,
      },
    });
  }
}
