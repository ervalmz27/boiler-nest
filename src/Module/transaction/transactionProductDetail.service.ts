import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_PRODUCT_DETAIL_PROVIDER } from '@/Helpers/contants';
import { TransactionProductDetail } from './entities/transactionProductDetail.entity';

@Injectable()
export class TransactionProductDetailsService {
  constructor(
    @Inject(TRANSACTION_PRODUCT_DETAIL_PROVIDER)
    private readonly repository: typeof TransactionProductDetail,
  ) {}

  async create(trxId, items) {
    items.map((e) => {
      e['transaction_id'] = trxId;
      return e;
    });
    return this.repository.bulkCreate(items);
  }
}
