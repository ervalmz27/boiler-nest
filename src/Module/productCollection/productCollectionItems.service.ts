import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_COLLECTION_ITEM_PROVIDER } from '@/Helpers/contants';
import { ProductCollectionItem } from './entities/productCollectionItem.entity';

@Injectable()
export class ProductCollectionItemsService {
  constructor(
    @Inject(PRODUCT_COLLECTION_ITEM_PROVIDER)
    private readonly repository: typeof ProductCollectionItem,
  ) {}

  async findByCollection(id) {
    return this.repository.findAll({
      where: {
        product_collection_id: id,
        deleted_at: null,
      },
    });
  }

  async findByItem(payload) {
    return this.repository.findAll({
      where: {
        product_id: payload.product_id,
        product_collection_id: payload.product_collection_id,
      },
      raw: true,
    });
  }

  async create(arrayPayload: any) {
    return await this.repository.bulkCreate(arrayPayload);
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }
}
