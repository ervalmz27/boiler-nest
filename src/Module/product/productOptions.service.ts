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
  async create(payload: any) {
    return await this.repository.create(payload);
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

  async calculateStock(payload) {
    let total = 0;
    const notEnoughStock = [];
    for (const e of payload) {
      if (e.item_type === 'PRODUCT') {
        const option = await this.repository.findOne({
          where: {
            id: e.product_option_id,
          },
          attributes: ['id', 'quantity'],
          raw: true,
        });

        console.log('Stock', option.quantity);
        if (option.quantity !== -1) {
          if (option.quantity >= 0) {
            const stockRemaining = option.quantity - parseInt(e.qty);
            this.logger.debug(`Stock: ${option.quantity} , Qty Buy: ${e.qty}`);
            if (stockRemaining < 0) {
              notEnoughStock.push({
                product_Id: e.product_id,
                product_option_id: e.product_option_id,
                qty_buy: e.qty,
                qty_stock: option.quantity,
              });
            }
          } else {
            notEnoughStock.push({
              product_Id: e.product_id,
              product_option_id: e.product_option_id,
              qty_buy: e.qty,
              qty_stock: option.quantity,
            });
          }
        }
      }

      return notEnoughStock;
    }
  }

  async calculateTotalCost(payload) {
    let total = 0;
    const productDetail = [];
    for (const e of payload) {
      if (e.item_type === 'PRODUCT') {
        const option = await this.repository.findOne({
          where: {
            id: e.product_option_id,
          },
          include: [{ model: Product }],
          // raw: true,
        });

        const productOption = option.dataValues;

        const subtotal = productOption.selling_price * e.qty;
        productDetail.push({
          product_id: e.product_id,
          product_name: productOption.product?.name || '-',
          product_option_id: e.product_option_id,
          price: productOption.selling_price,
          qty: e.qty,
          subtotal: subtotal,
        });
        total = total + subtotal;
      }
    }

    return {
      detail: productDetail,
      total: total,
    };
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

  async revertStock(productOptions) {
    for (const o of productOptions) {
      const options = await this.repository.findOne({
        where: {
          id: o.product_option_id,
        },
      });
      options.quantity = options.quantity + o.qty;
      options.save();
    }
  }
}
