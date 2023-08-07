import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_PROVIDER } from '@/Helpers/contants';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class ImportService {
  constructor(
    @Inject(PRODUCT_PROVIDER)
    private readonly repository: typeof Product,
  ) {}

  async getUniqueProduct(arrayData) {
    var flags = [],
      output = [],
      l = arrayData.length,
      i;
    for (i = 0; i < l; i++) {
      if (flags[arrayData[i]['SKU number']]) continue;
      flags[arrayData[i]['SKU number']] = true;
      output.push(arrayData[i]);
    }

    return output;
  }
}
