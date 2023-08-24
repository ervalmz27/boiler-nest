import { Inject, Injectable, Logger } from '@nestjs/common';
import { PRODUCT_TAG_PROVIDER } from '@/Helpers/contants';
import { ProductTag } from './entities/productTag.entity';
import { Op } from 'sequelize';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class ProductTagService {
  private readonly logger = new Logger(ProductTagService.name);

  constructor(
    @Inject(PRODUCT_TAG_PROVIDER)
    private readonly repository: typeof ProductTag,
  ) {}

  async findAll(payload: any): Promise<ProductTag[]> {
    const { q } = payload;

    return await this.repository.findAll<ProductTag>({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: q,
            },
          },
          {
            description: {
              [Op.substring]: q,
            },
          },
        ],
      },
      include: [
        {
          model: Product,
          attributes: ['name'],
        },
      ],
    });
  }

  async findByProduct(product_id) {
    return this.repository.findAll({
      where: { product_id },
      order: [['name', 'desc']],
      attributes: ['name'],
    });
  }

  async findOne(id: number) {
    return await this.repository.findByPk(id);
  }

  async findByName(name) {
    return await this.repository.findOne({
      where: {
        name,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: any) {
    return await this.repository
      .create<ProductTag>({
        ...payload,
        raw: true,
      })
      .catch((err) => this.logger.error(err.message));
  }

  async findAndCreate(payload) {
    const category = await this.repository.findOne({
      where: {
        name: payload.name,
      },
    });

    if (category === null) {
      return await this.repository.create({
        name: payload.name,
      });
    }

    return category;
  }

  async upsert(payload: any) {
    return this.repository
      .findOne({
        where: {
          name: payload.name,
        },
      })
      .then((result) => {
        if (result === null) {
          return this.repository.create({
            name: payload.name,
          });
        }
        return result;
      });
  }

  async update(id: number, payload: any) {
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

  async bulkCreate(id, payload) {
    const ret = [];
    for (const p of payload) {
      ret.push({
        product_id: id,
        name: p,
      });
    }

    return await this.repository.bulkCreate(ret);
  }
}
