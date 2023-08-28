import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_PRODUCT_DETAIL_PROVIDER } from '@/Helpers/contants';
import { TransactionDetail } from '../entities/transactionProductDetail.entity';

@Injectable()
export class TransactionProductDetailsService {
  constructor(
    @Inject(TRANSACTION_PRODUCT_DETAIL_PROVIDER)
    private readonly repository: typeof TransactionDetail,
  ) {}

  async create(trxId, items) {
    items.map((e) => {
      e['transaction_id'] = trxId;
      return e;
    });
    return this.repository.bulkCreate(items);
  }
}
