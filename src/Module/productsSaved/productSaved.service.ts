import { Inject, Injectable, Logger } from '@nestjs/common';
import { PRODUCT_SAVED_PROVIDER } from '@/Helpers/contants';

import { CreateSavedProductDto } from './dto/createSavedProduct.dto';

import { ProductSaved } from './entities/productSaved.entity';
import { Member } from '../member/entities/member.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class ProductSavedService {
  private readonly logger = new Logger(ProductSavedService.name);

  constructor(
    @Inject(PRODUCT_SAVED_PROVIDER)
    private readonly repository: typeof ProductSaved,
  ) {}

  async findAll(payload) {
    return await this.repository.findAll({
      where: payload,
      include: [{ model: Member }, { model: Product }],
    });
  }

  async findAllNested(payload) {
    return await this.repository.findAll({
      where: payload,
      include: { all: true, nested: true },
    });
  }

  async findOne(id: number) {
    return await this.repository.findByPk(id);
  }

  async isProductSaved({ product_id, member_id }) {
    return this.repository
      .count({
        where: {
          product_id,
          member_id,
        },
      })
      .then((result) => {
        if (result > 0) {
          return true;
        }
        return false;
      });
  }

  async upsert({ product_id, member_id }) {
    return await this.repository
      .findOne({
        where: {
          product_id,
          member_id,
        },
      })
      .then((result) => {
        if (!result) {
          return this.repository
            .create({
              product_id,
              member_id,
            })
            .catch((error) => {
              this.logger.error(error.message);
            });
        }
        return result;
      });
  }

  async create(payload: CreateSavedProductDto) {
    return await this.repository.create({
      ...payload,
    });
  }

  async remove({ member_id, product_id }) {
    return await this.repository.destroy({
      where: {
        member_id,
        product_id,
      },
      force: true,
    });
  }
}
