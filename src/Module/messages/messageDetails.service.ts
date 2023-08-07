import { Inject, Injectable } from '@nestjs/common';
import { MESSAGE_DETAIL_PROVIDER } from '@/Helpers/contants';
import { MessageDetails } from './entities/messageDetail.entity';
import { Op } from 'sequelize';
import { Member } from '../member/entities/member.entity';
const moment = require('moment-timezone');

@Injectable()
export class MessageDetailsService {
  constructor(
    @Inject(MESSAGE_DETAIL_PROVIDER)
    private readonly repository: typeof MessageDetails,
  ) {}

  async storeDetail({ id, send_at, message, photo, publish_status }, members) {
    const newPayload = [];
    if (members.length > 0) {
      members.forEach((e) => {
        newPayload.push({
          message_id: id,
          member_id: e.id,
          send_at,
          message_content: message,
          photo,
          phone: e.phone,
          status: 'PENDING',
          publish_status,
        });
      });
    }
    return this.repository.bulkCreate(newPayload);
  }

  async truncateMessageDetail(messageId) {
    return this.repository.destroy({
      where: {
        message_id: messageId,
      },
      force: true,
    });
  }

  async findPending() {
    const currentTime = moment().tz('Asia/Hong_Kong').toDate();

    return this.repository.findAll({
      where: {
        status: 'PENDING',
        publish_status: 'PUBLISHED',
        last_send_at: null,
        remarks: null,
        send_at: {
          [Op.lte]: currentTime,
        },
      },
      raw: true,
    });
  }

  async updateStatus(id, { status, remarks = null, sender_id = null }) {
    const currentTime = moment().tz('Asia/Hong_Kong').toDate();
    return this.repository.update(
      {
        last_sent_at: currentTime,
        status,
        sender_id,
        remarks,
      },
      {
        where: {
          id,
        },
      },
    );
  }

  async setAsSuccess(messageId) {
    const currentTime = moment().tz('Asia/Hong_Kong').toDate();
    return this.repository.update(
      {
        status: 'SUCCESS',
        last_send_at: currentTime,
      },
      {
        where: {
          id: messageId,
        },
      },
    );
  }

  async setAsPending(messageId, remarks = '') {
    const currentTime = moment().tz('Asia/Hong_Kong').toDate();
    return this.repository.update(
      {
        status: 'PENDING',
        remarks: remarks,
        last_send_at: currentTime,
      },
      {
        where: {
          id: messageId,
        },
      },
    );
  }

  async setAsFailed(messageId, remarks = '') {
    const currentTime = moment().tz('Asia/Hong_Kong').toDate();
    return this.repository.update(
      {
        status: 'FAILED',
        remarks: remarks,
        last_send_at: currentTime,
      },
      {
        where: {
          id: messageId,
        },
      },
    );
  }

  async findBySenderId(id) {
    return this.repository.findOne({
      where: {
        sender_id: id,
      },
    });
  }

  async updateDeliveryStatus(id, payload) {
    return this.repository.update(payload, {
      where: {
        sender_id: id,
      },
    });
  }

  async findByMessageId(messageId) {
    return this.repository.findAll({
      where: {
        message_id: messageId,
      },
      include: [{ model: Member }],
    });
  }
}
