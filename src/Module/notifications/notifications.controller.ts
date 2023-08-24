import {
  Controller,
  HttpStatus,
  Res,
  Body,
  Post,
  Get,
  Delete,
  Param,
  Put,
  Logger,
} from '@nestjs/common';

import Helpers from '@/Helpers/helpers';
import { NotificationsService } from './notifications.service';
import { LogNotificationsService } from './logNotifications.service';
import { RESPONSES } from '@/Helpers/contants';
import { TEMPLATE_ID } from '@/Helpers/contants/sengridtemplate';

import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  private readonly helpers = new Helpers();
  constructor(
    private readonly service: NotificationsService,
    private readonly logSevice: LogNotificationsService,
  ) {}

  @Get()
  async findAll(@Res() res) {
    const feeds = await this.service.findAll();
    if (feeds.length < 1) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        feeds,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      feeds,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const user = await this.service.findOne(+id);
    if (user === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        user,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      user,
    );
  }

  @Post()
  async create(@Body() payload: NotificationDto, @Res() res) {
    const newPayload = {
      ...payload,
      status: 'PENDING',
    };
    const data = await this.service.create(newPayload);
    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: NotificationDto,
    @Res() res,
  ) {
    const data = await this.service.findOne(id);
    if (data === null) {
      return res.status(404).json({ data, message: 'Data not found' });
    }
    if (data.status === 'SENT') {
      return this.helpers.response(
        res,
        HttpStatus.BAD_REQUEST,
        'Cannot update notification because status is SENT',
        null,
      );
    }

    const modifyFeed = await this.service.update(+id, payload);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      modifyFeed,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    const data = await this.service.findOne(id);
    if (data === null) {
      return res.status(404).json({ data, message: 'Data not found' });
    }
    if (data.status === 'SENT') {
      return this.helpers.response(
        res,
        HttpStatus.BAD_REQUEST,
        'Cannot delete notification because its already Sent to User',
        null,
      );
    }

    const removeData = await this.service.remove(+id);
    if (removeData > 0) {
      return this.helpers.response(res, HttpStatus.OK, RESPONSES.DATA_DELETED, {
        deletedId: id,
      });
    }

    return this.helpers.response(
      res,
      HttpStatus.BAD_REQUEST,
      RESPONSES.FAIL_DELETED,
      null,
    );
  }

  @Post('/sendEmail')
  async sendEmail(@Body() payload: any, @Res() res) {
    const sendmail = await this.service.sendEmail(payload);

    this.logSevice.storeLog({
      service_sender: payload.service_sender || 'GENERIC',
      requestPayload: sendmail.payload,
      responseData: sendmail.response,
      statusCode: sendmail.statusCode,
      isSuccess: sendmail.isSuccess,
    });

    if (!sendmail.isSuccess) {
      return this.helpers.response(
        res,
        HttpStatus.BAD_REQUEST,
        'Fail Sending Mail',
        null,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      'Success Sending Mail',
      null,
    );
  }

  @Post('test')
  async sendTest(@Body() payload: any, @Res() res) {
    this.service.sendEmail({
      destination: 'ronaldochristover@gmail.com',
      templateId: TEMPLATE_ID.ORDER_CONFIRMATION,
      templatePayload: {
        Order_No: 'TEST0001',
        Order_Date: '23 OKTOBER 1990',
        order_payment_method: 'PAYLOAD ',
        delivery_name: 'RONALDO',
        delivery_address: 'BANDUNG',
        delivery_method: 'JNE',
        delivery_phone: 'TEST082222',
        order_item: [
          {
            name: 'product a',
            qty: 10,
            price: 1000,
            totalprice: 10000,
          },
        ],
        order_subtotal: 10000,
        order_discount: 100,
        order_delivery: 200,
        gift_redemption: 99,
        order_total: 100,
      },
    });
    return res.send({
      status: true,
    });
  }
}
