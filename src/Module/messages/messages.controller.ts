import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Res,
  Req,
  Body,
  Delete,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v1 as uuidv1 } from 'uuid';
import axios from 'axios';
const FormData = require('form-data');

import { MessagesService } from './messages.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MembersService } from '../member/members.service';
import { MessageDetailsService } from './messageDetails.service';

import { RESPONSES } from '@/Helpers/contants';
import SpaceFile from '@/Helpers/files';
import Helpers from '@/Helpers/helpers';
import { allowRunningCron } from '@/Config/generic.config';
import { WABLAS_TOKEN, WABLAS_URL } from '@/Config/notification.config';
import { MemberTiersService } from '../memberTier/memberTiers.service';

@Controller('messages')
export class MessagesController {
  private readonly helpers = new Helpers();
  private spacefile = new SpaceFile();
  private readonly logger = new Logger(MessagesController.name);

  constructor(
    private readonly service: MessagesService,
    private readonly memberService: MembersService,
    private readonly memberTierService: MemberTiersService,
    private readonly messageDetailService: MessageDetailsService,
  ) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const payload = req.query;

    const ret = [];
    const messages = await this.service.findAll(payload);

    if (messages.length < 1)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ data: [], message: 'Data not found' });

    for (const e of messages) {
      const tiers = await this.memberTierService.findByTierId(
        JSON.parse(e.tiers),
      );
      ret.push({
        id: e.id,
        send_to: e.send_to,
        title: e.title,
        tiers: tiers,
        message: e.message,
        image: e.image,
        status: e.status,
      });
    }

    return res.status(HttpStatus.OK).json({ data: ret, message: 'Data found' });
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const data = await this.service.findOne2(+id);
    if (data === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        null,
      );
    }

    const tiers = JSON.parse(data.tiers);
    const tierList = await this.memberTierService.findByTierId(tiers);

    data['tier_list'] = tierList;
    data['details'] = await this.messageDetailService.findByMessageId(id);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      data,
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() payload: any,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'messages',
        file.mimetype,
      );

      if (fileObject) {
        payload['image'] = fileObject.Location;
      }
    }
    const jsonTiers = JSON.parse(payload.tiers);
    payload['tiers'] = payload.tiers;

    const data = await this.service.create(payload);
    const members = await this.memberService.findByTier(jsonTiers);
    await this.messageDetailService.storeDetail(
      {
        id: data.id,
        send_at: payload.send_at,
        message: payload.message,
        photo: data.image,
        publish_status: data.status,
      },
      members,
    );

    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() payload: any,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'messages',
        file.mimetype,
      );

      if (fileObject) {
        payload['image'] = fileObject.Location;
      }
    }

    const message = await this.service.findOne(id);
    if (message === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        message,
      );
    }

    const jsonTiers = JSON.parse(payload.tiers);
    payload['tiers'] = payload.tiers;

    const updateData = await this.service.update(+id, payload);

    const members = await this.memberService.findByTier(jsonTiers);

    await this.messageDetailService.truncateMessageDetail(id);
    await this.messageDetailService.storeDetail(
      {
        id,
        send_at: payload.send_at,
        message: payload.message,
        photo: payload.image || null,
        publish_status: payload.status,
      },
      members,
    );

    if (typeof payload.is_default !== 'undefined' && payload.is_default === 1) {
      await this.service.setAsDefault(id);
    }
    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateData,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
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

  @Cron(CronExpression.EVERY_MINUTE, {
    timeZone: 'Asia/Hong_Kong',
  })
  async sendMessage() {
    if (allowRunningCron) {
      this.logger.log('CRON | Sending Message');
      const pendingMessage = await this.messageDetailService.findPending();
      for (const msg of pendingMessage) {
        if (msg.photo === null) {
          await this.handleTextMessage(msg);
        }
        if (msg.photo !== null && msg.photo !== '') {
          await this.handleMessageWithImage(msg);
        }
      }
    }
  }

  async handleTextMessage(msg) {
    let data = new FormData();
    data.append('phone', msg.phone);
    data.append('message', msg.message_content);

    let config = {
      method: 'post',
      url: WABLAS_URL + '/api/send-message',
      headers: {
        Authorization: WABLAS_TOKEN,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const responseData = response.data.data;
        const messageDetails = responseData.messages[0];

        const messageStatuses = {
          sent: 'SUCCESS',
          cancel: 'CANCELED',
          received: 'SUCCESS',
          reject: 'FAILED',
          pending: 'WAITING_STATUS',
        };

        let messageStatus = messageStatuses[messageDetails.status];

        if (!messageStatus) {
          messageStatus = 'UNKNOWN';
        }

        const updateStatusPayload = {
          status: messageStatus,
          sender_id: messageDetails.id,
          remarks: JSON.stringify(messageDetails),
        };

        this.messageDetailService.updateStatus(msg.id, updateStatusPayload);
      })
      .catch((error) => {
        this.logger.error('Failed send text message', error.message);
        console.error(error);
      });
  }

  async handleMessageWithImage(msg) {
    let data = new FormData();
    data.append('phone', msg.phone);
    data.append('image', msg.photo);
    data.append('caption', msg.message_content);

    let config = {
      method: 'POST',
      url: WABLAS_URL + '/api/send-image',
      headers: {
        Authorization: WABLAS_TOKEN,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const responseData = response.data.data;
        const messageDetails = responseData.messages[0];

        const messageStatuses = {
          sent: 'SUCCESS',
          cancel: 'CANCELED',
          received: 'SUCCESS',
          reject: 'FAILED',
          pending: 'WAITING_STATUS',
        };

        let messageStatus = messageStatuses[messageDetails.status];

        if (!messageStatus) {
          messageStatus = 'UNKNOWN';
        }

        const updateStatusPayload = {
          status: messageStatus,
          sender_id: messageDetails.id,
          remarks: JSON.stringify(messageDetails),
        };

        this.messageDetailService.updateStatus(msg.id, updateStatusPayload);
      })
      .catch((error) => {
        this.logger.error('Failed send image message', error.message);
        console.error(error);
      });
  }
}
