import { Op } from 'sequelize';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PRODUCT_COLLECTION_PROVIDER } from '@/Helpers/contants';

import { ProductCollection } from './entities/productCollection.entity';
import { ProductCollectionItem } from './entities/productCollectionItem.entity';

import { CreateProductCollectionDto } from './dto/create-productCollection.dto';
import { UpdateProductCollectionDto } from './dto/update-productCollection.dto';

@Injectable()
export class ProductCollectionsService {
  private readonly logger = new Logger(ProductCollectionsService.name);

  constructor(
    @Inject(PRODUCT_COLLECTION_PROVIDER)
    private readonly repository: typeof ProductCollection,
  ) {}

  async findAll(payload: any): Promise<ProductCollection[]> {
    const { q, is_published } = payload;

    const whereCond = {};
    if (q && q !== '') {
      whereCond['name'] = {
        [Op.like]: `%${q}%`,
      };
    }

    if (is_published && is_published !== '') {
      whereCond['is_published'] = is_published;
    }

    return await this.repository.findAll<ProductCollection>({
      where: whereCond,
      order: [['created_at', 'desc']],
      include: [{ model: ProductCollectionItem }],
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: { id: id },
      include: [{ model: ProductCollectionItem }],
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: CreateProductCollectionDto) {
    return this.repository.create<ProductCollection>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateProductCollectionDto) {
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
