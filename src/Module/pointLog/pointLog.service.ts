import { Inject, Injectable } from '@nestjs/common';
import { POINTLOG_PROVIDER } from '@/Helpers/contants';
import { PointLog } from './pointLog.entity';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class PointLogService {
  constructor(
    @Inject(POINTLOG_PROVIDER)
    private readonly repository: typeof PointLog,
  ) {}

  async addPointLog({ member_id, points = 1, transaction_id, remarks = '' }) {
    return this.repository.create({
      member_id,
      points,
      transaction_id,
      remarks,
    });
  }

  async getByMember(member_id) {
    return this.repository.findAll({
      where: {
        member_id: member_id,
      },
      include: [{ model: Transaction, attributes: ['order_number'] }],
      order: ['id', 'DESC'],
    });
  }

  async findBy(whereCond = {}) {
    return this.repository.findAll({
      where: whereCond,
      attributes: ['points'],
    });
  }
}
