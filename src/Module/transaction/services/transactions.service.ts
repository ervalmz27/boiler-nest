import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';

import { TRANSACTION_PROVIDER } from '@/Helpers/contants';
import { Transaction } from '../entities/transaction.entity';

import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionDetail } from '../entities/transactionProductDetail.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { Product } from '../../product/entities/product.entity';
import { ProductTag } from '../../productTag/entities/productTag.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(TRANSACTION_PROVIDER)
    private readonly repository: typeof Transaction,
  ) { }

  async findAll(payload: any) {
    const { q, category_id, tags, location, sort } = payload;

    const filter = null;
    let tagFilter = null;
    const productFilter = {};
    const productDetailFilter = {};
    let ordering = [];
    [['created_at', 'DESC']];

    if (sort === 'is_popular') {
      ordering.push(['total', 'DESC']);
    }

    if (sort === 'is_relevant') {
      ordering.push(['created_at', 'DESC']);
    }

    if (q && q !== '') {
      filter['order_number'] = q;
    }
    if (location && location !== '') {
      filter['location'] = location;
    }

    if (category_id && category_id !== '') {
      productFilter['category_id'] = category_id;
    }

    if (tags && tags !== '') {
      tagFilter['id'] = tags.split(',');
    }
    console.log("hello", tagFilter);
    console.log("filter", filter);
    return await this.repository.findAll<Transaction>({
      where: filter,
      order: ordering,
      include: [
        {
          model: TransactionDetail,
          where: productDetailFilter,
          include: [
            {
              model: Product,
              where: productFilter,
              attributes: {
                exclude: ['created_at', 'deleted_at', 'updated_at'],
              },
              include: [
                {
                  model: ProductTag,
                  where: tagFilter,
                  attributes: {
                    exclude: ['created_at', 'deleted_at', 'updated_at'],
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async findById(orderId) {
    return this.repository.findOne({
      where: {
        id: orderId,
      },
      raw: true,
    });
  }

  // Criteria:
  // - Show all transaction status from custom payment
  // - Only Show success transaction from online payment
  // - Show only transacton which have order number
  async findAllWithCriteria(payload: any) {
    const { q, customer_id, limit } = payload;

    const pageLimit = parseInt(limit ?? '9999999999');

    return await this.repository.findAll<Transaction>({
      where: {
        order_number: {
          [Op.not]: null,
        },
      },
      limit: pageLimit,
      order: [['created_at', 'DESC']],
      // include: { all: true, nested: true },
    });
  }

  async findByCoupon(coupon_id) {
    return this.repository.findAll({
      where: {
        coupon_id,
      },
      include: [{ model: Customer }],
      order: [['created_at', 'desc']],
    });
  }

  async findUserTransaction(payload: any) {
    const { q, customer_id, status } = payload;

    const filter = {
      customer_id: customer_id,
      [Op.or]: [
        {
          order_number: {
            [Op.substring]: q || '',
          },
        },
      ],
    };

    if (status) {
      filter['status'] = status;
    }

    return await this.repository.findAll<Transaction>({
      where: filter,
      order: [['created_at', 'DESC']],
      include: { all: true, nested: true },
    });
  }

  async findOne(id: string) {
    return await this.repository.findOne({
      where: {
        id,
      },
      include: { all: true, nested: true },
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: any) {
    return await this.repository.create(payload);
  }

  async update(id: number, payload: UpdateTransactionDto) {
    return await this.repository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async updateTransactionStatus(id, status) {
    return await this.repository.update({ status }, { where: { id } });
  }

  async updateDeliveryStatus(id, delivery_status) {
    return await this.repository.update(
      {
        delivery_status,
      },
      {
        where: { id },
      },
    );
  }

  async updatePaymentStatus(id: string, payment_status) {
    return await this.repository.update(
      { payment_status },
      {
        where: { id },
      },
    );
  }

  async updateDeliveryRemark(id: string, { delivery_remark }) {
    return await this.repository.update(
      { delivery_remark },
      {
        where: { id },
      },
    );
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }

  async generateOrderNumber() {
    const latestOrder = await this.repository.findAll({
      where: {
        order_number: {
          [Op.not]: null,
          [Op.like]: 'YKS%',
        },
      },
      limit: 1,
      order: [
        ['created_at', 'DESC'],
        ['order_number', 'desc'],
      ],
      raw: true,
      attributes: ['order_number'],
    });

    if (latestOrder.length > 0) {
      const lastOrderNo = latestOrder[0].order_number;
      const latestNumber = parseInt(lastOrderNo.replace('YKS', ''));
      const newNumber = '000000' + (latestNumber + 1);
      return 'YKS' + newNumber;
    } else {
      return 'YKS000001';
    }
  }

  async addIntentToTransaction(paymentIntentId, status) {
    return await this.repository.update(
      {
        payment_status: status,
      },
      {
        where: {
          payment_detail: paymentIntentId,
        },
      },
    );
  }

  async updateStatusByOrderId(orderId, status, detail = null) {
    return this.repository.update(
      {
        payment_status: status,
        order_number:
          status === 'PAID' ? await this.generateOrderNumber() : null,
        payment_detail: JSON.stringify(detail),
      },
      {
        where: {
          id: orderId,
        },
      },
    );
  }

  async updateStripePaymentAsSuccess({ order_id, detail }) {
    return this.repository.update(
      {
        payment_status: 'PAID',
        order_number: await this.generateOrderNumber(),
        payment_detail: JSON.stringify(
          {
            payment_intent_id: detail.object.id,
          } || null,
        ),
      },
      {
        where: {
          id: order_id,
        },
      },
    );
  }

  async updatePaymePaymentAsSuccess({ order_id, payment_detail }) {
    return this.repository.update(
      {
        payment_status: 'PAID',
        order_number: await this.generateOrderNumber(),
      },
      {
        where: {
          id: order_id,
          payment_detail: payment_detail,
        },
      },
    );
  }

  async addPoints(transactionId, points = 0) {
    return this.repository.update(
      {
        points: points,
      },
      {
        where: {
          id: transactionId,
        },
      },
    );
  }

  async findByMonthAndYear(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await this.repository.findAll({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: ['created_at', 'total'],
      order: [['created_at', 'desc']],
      raw: true,
    });

    return records;
  }

  async findDiscountFromTransaction(discountId) {
    return await this.repository.findAll({
      where: {
        discount_id: discountId,
      },
      order: [['created_at', 'DESC']],
      attributes: [
        'discount_id',
        'discount_code',
        'discount_detail',
        'total_discount_code',
      ],
    });
  }

  async expiredChecking() {
    return this.repository.findAll({
      where: {
        order_number: null,
        status: 'PENDING',
        payment_status: 'PENDING',
      },
      include: [
        {
          model: TransactionDetail,
          attributes: ['id', 'product_option_id', 'qty'],
        },
      ],
      attributes: ['id', 'created_at'],
    });
  }

  async markAsCanceled(trxIds) {
    return this.repository.update(
      {
        payment_status: 'CANCELED',
        status: 'CANCELED',
      },
      {
        where: {
          id: trxIds,
        },
      },
    );
  }

  async getTotalSpendingByCustomer(customer_id) {
    const total = this.repository.sum('total', {
      where: {
        customer_id,
      },
    });

    return total === null ? 0 : total;
  }
}
