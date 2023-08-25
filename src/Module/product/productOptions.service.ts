import { Inject, Injectable, Logger } from '@nestjs/common';
import { PRODUCT_OPTION_PROVIDER } from '@/Helpers/contants';
import { ProductOption } from './entities/productOption.entity';
import { Op } from 'sequelize';
import { Product } from './entities/product.entity';
import sequelize from 'sequelize';

@Injectable()
export class ProductOptionsService {
  private readonly logger = new Logger(ProductOptionsService.name);

  constructor(
    @Inject(PRODUCT_OPTION_PROVIDER)
    private readonly repository: typeof ProductOption,
  ) {}

  async findOne(where = {}) {
    return this.repository.findOne({
      where: where,
      raw: true,
    });
  }

  async findBySKUName({ product_id, name }) {
    return this.repository.findOne({
      where: {
        name: name,
        product_id: product_id,
      },
    });
  }

  async validateProductOption(productOptions) {
    let total = 0;
    const detail = [];
    let valid = true;
    for (const opt of productOptions) {
      const data = await this.repository.findOne({
        where: {
          id: opt.product_option_id,
        },
        raw: true,
      });
      if (opt.qty > data.quantity) {
        valid = false;
      }
      if (data !== null) {
        const subtotal = opt.qty * data.selling_price;
        detail.push({
          product_id: data.product_id,
          product_option_id: data.id,
          price: data.selling_price,
          qty: opt.qty,
          subtotal: subtotal,
        });
        total += subtotal;
      }
    }
    return {
      valid,
      detail,
      total,
    };
  }

  //
  async create(payload: any) {
    return await this.repository.create(payload);
  }

  //
  async createOrUpdate(id, payload) {
    for (const option of payload) {
      if (option.id !== null) {
        await this.repository.update(
          {
            product_id: option.product_id,
            name: option.name,
            sku_no: option.sku_no,
            quantity: option.quantity,
            list_price: option.list_price,
            selling_price: option.selling_price,
            weight: option.weight,
            weight_unit: option.weight_unit,
          },
          { where: { id: option.id } },
        );
      } else {
        await this.repository.create({
          product_id: id,
          name: option.name,
          sku_no: option.sku_no,
          quantity: option.quantity,
          list_price: option.list_price,
          selling_price: option.selling_price,
          weight: option.weight,
          weight_unit: option.weight_unit,
        });
      }
    }
  }

  async removeOptions(optionList) {
    for (const option of optionList) {
      await this.repository.destroy({
        where: { id: option },
      });
    }
  }

  async import(payload: any) {
    return this.repository.bulkCreate(payload);
  }

  async update(payload: any) {
    return await this.repository.update(
      {
        name: payload.name,
        quantity: payload.quantity,
        selling_price: payload.selling_price,
        list_price: payload.list_price,
        currency: payload.currency,
        weight: payload.weight,
        weight_unit: payload.weight_unit,
      },
      {
        where: {
          id: payload.id,
          product_id: payload.product_id,
        },
      },
    );
  }

  async updateById(id, payload) {
    return this.repository.update(payload, { where: { id } });
  }

  async bulkCreate(productId, options) {
    let payloads = [];
    options.forEach((e) => {
      e.product_id = productId;
      payloads.push(e);
    });
    return await this.repository.bulkCreate(payloads).catch((e) => {
      this.logger.error(`ERR PRODUCTOPTION :: ` + e.message);
    });
  }

  async remove(id: any) {
    return await this.repository.destroy({
      where: {
        id: id,
      },
      force: true,
    });
  }

  async deductStock(payload) {
    for (const e of payload) {
      if (e.item_type === 'PRODUCT') {
        const option = await this.repository.findOne({
          where: {
            id: e.product_option_id,
          },
        });
        option.quantity -= e.qty;
        option.save();
      }
    }
  }

  async checkStockUnderLimit(payload) {
    const underLimitProductArray = [];
    for (const e of payload) {
      if (e.item_type === 'PRODUCT') {
        const option = await this.repository.findOne({
          where: {
            id: e.product_option_id,
          },
          attributes: ['name', 'quantity'],
          include: [{ model: Product, attributes: ['name', 'stock_limit'] }],
        });

        console.log('option.quantity', option.quantity);
        console.log('option.stock_limit', option.product.stock_limit);
        if (option.quantity >= option.product.stock_limit) {
          underLimitProductArray.push({
            product_id: option.product_id,
            product_name: option.product?.name,
            product_option_name: option.name,
            quantity: option.quantity,
            stock_limit: option.product?.stock_limit || 0,
          });
        }
      }
    }
    return underLimitProductArray;
  }

  async getUnderStockProductOption(productId, limit) {
    return await this.repository.findAll({
      where: {
        product_id: productId,
        stock: {
          [Op.lte]: limit,
        },
      },
      include: [{ model: Product }],
    });
  }
}
