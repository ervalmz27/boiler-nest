import { Inject, Injectable } from '@nestjs/common';
import { MESSAGE_PROVIDER } from '@/Helpers/contants';
import { Messages } from './entities/messages.entity';
import { CreateMessageDto } from './dto/messages.dto';
import { UpdateMessageDto } from './dto/update-memberTier.dto';
import { Op } from 'sequelize';
import { MemberTier } from '../memberTier/entities/memberTier.entity';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MESSAGE_PROVIDER)
    private readonly repository: typeof Messages,
  ) {}

  async findAll(payload) {
    let cond = {};
    if (typeof payload.tier_id !== 'undefined') {
      cond['tiers'] = {
        [Op.like]: '%' + payload.tier_id + '%',
      };
    }

    if (typeof payload.status !== 'undefined') {
      cond['status'] = payload.status;
    }
    return await this.repository.findAll({
      where: cond,
      order: [['created_at', 'desc']],
    });
  }
  // async findAll(payload: any) {
  //   const { q, tier_id, status } = payload;
  //   const filterQuery = {};

  //   if (typeof q !== 'undefined') {
  //     filterQuery['title'] = {
  //       [Op.substring]: q || '',
  //     };
  //   }

  //   if (typeof tier_id !== 'undefined') {
  //     filterQuery['tier_id'] = tier_id;
  //   }

  //   if (typeof status !== 'undefined') {
  //     filterQuery['status'] = status;
  //   }

  //   return await this.repository.findAll({
  //     order: [['id', 'DESC']],
  //     where: filterQuery,
  //     include: [{ model: MemberTier }],
  //   });
  // }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      include: {
        nested: true,
        all: true,
      },
    });
  }

  async findOne2(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      raw: true,
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: CreateMessageDto) {
    return await this.repository.create<Messages>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateMessageDto) {
    return await this.repository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async setAsDefault(id: number) {
    return await this.repository.update(
      { is_default: 0 },
      {
        where: {
          id: {
            [Op.not]: id,
          },
        },
      },
    );
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }
}
