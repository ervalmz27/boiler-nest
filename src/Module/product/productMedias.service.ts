import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_MEDIA_PROVIDER } from '@/Helpers/contants';
import { ProductMedia } from './entities/productMedia.entity';

@Injectable()
export class ProductMediasService {
  constructor(
    @Inject(PRODUCT_MEDIA_PROVIDER)
    private readonly repository: typeof ProductMedia,
  ) { }

  async create(id, urls, type = 'image') {
    const payload = [];
    console.log(urls);
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      payload.push({
        product_id: id,
        type: type,
        path: url,
        order_no: i + 1,
      });
    }
    return await this.repository.bulkCreate(payload);
  }

  async deleteFiles(arrayId) {
    // TODO: Delete file di DO
    const deletedArray = arrayId.split(',');
    return await this.repository.destroy({
      where: {
        id: deletedArray,
      },
      force: true,
    });
  }

  async truncateMediasByProduct(product_id) {
    return this.repository.destroy({
      where: {
        product_id: product_id,
      },
    });
  }
  async bulkCreate(productId, options) {
    let payloads = [];
    for (let i = 0; i < options.length; i++) {
      const element = options[i];
      const created = {
        product_id: productId,
        type: 'image',
        path: element,
      }
      payloads.push(created);

    }

    return await this.repository
      .bulkCreate(payloads)
      .catch((error) => console.error(error));
  }
}
