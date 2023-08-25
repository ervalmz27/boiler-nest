import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_LOG_PROVIDER } from '@/Helpers/contants';
import { TransactionLog } from '../entities/transactionPaymentLog.entity';

@Injectable()
export class TransactionLogServices {
  constructor(
    @Inject(TRANSACTION_LOG_PROVIDER)
    private readonly repository: typeof TransactionLog,
  ) {}

  async getPaymentLog(transaction_id) {
    return this.repository.findAll({
      where: {
        transaction_id,
        type: 'payment',
      },
      order: [['created_at', 'desc']],
    });
  }

  async getDeliveryLog(transaction_id) {
    return this.repository.findAll({
      where: {
        transaction_id,
        type: 'delivery',
      },
      order: [['created_at', 'desc']],
    });
  }

  async create(id, type, log) {
    return this.repository.create({
      transaction_id: id,
      type,
      log,
    });
  }
}
