import { Inject, Injectable } from '@nestjs/common';
import { CART_PROVIDER } from '@/Helpers/contants';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_PROVIDER)
    private readonly repository: typeof Cart,
  ) {}

  async getProductItem(memberId) {
    return await this.repository.findAll({
      where: {
        item_type: 'PRODUCT',
        member_id: memberId,
      },
      include: { all: true, nested: true },
    });
  }

  async getEventItem(memberId) {
    return await this.repository.findAll({
      where: {
        item_type: 'EVENT',
        member_id: memberId,
      },
      include: { all: true, nested: true },
    });
  }

  async findAll() {
    return await this.repository.findAll({
      raw: true,
    });
  }

  async findOne(id: number) {
    return await this.repository.findByPk(id);
  }

  async findEventonCart(payload) {
    return await this.repository.findOne({
      where: payload,
    });
  }

  async findById(id: number) {
    return await this.repository.findOne({
      where: {
        id,
      },
      raw: true,
    });
  }

  async addProduct(payload: any) {
    const { product_id, product_option_id, member_id, qty } = payload;

    let cartItem = await this.repository.findOne({
      where: {
        product_id,
        product_option_id,
        member_id,
      },
    });

    if (!cartItem) {
      cartItem = await this.repository.create({
        item_type: 'PRODUCT',
        member_id,
        product_id,
        product_option_id,
        qty,
      });
    } else {
      cartItem.qty += qty;
      await cartItem.save();
    }

    return cartItem;
  }

  async addEvent(payload: any) {
    const { member_id, event_id, event_timeslot_id, event_ticket_id, qty } =
      payload;
    return this.repository.create({
      item_type: 'EVENT',
      member_id,
      event_id,
      event_timeslot_id,
      event_ticket_id,
      qty,
    });
  }

  async updateEvent(payload: any) {
    const { event_id, event_timeslot_id, event_ticket_id, qty } = payload;
    return this.repository.update(
      {
        qty,
      },
      {
        where: {
          event_id,
          event_timeslot_id,
          event_ticket_id,
        },
      },
    );
  }

  async updateProduct(payload: any) {
    const { id, qty } = payload;

    return await this.repository
      .findOne({
        where: {
          id: id,
        },
      })
      .then(() => {
        return this.repository.update(
          {
            qty: qty,
          },
          {
            where: {
              id,
            },
          },
        );
      });
  }

  async deleteItem(id) {
    return this.repository.destroy({
      where: {
        id: id,
      },
      force: true,
    });
  }

  async clearCart(memberId, items: any) {
    try {
      items.map(async (e) => {
        await this.repository.destroy({
          where: {
            product_id: e.product_id,
            product_option_id: e.product_option_id,
            member_id: memberId,
          },
        });
      });
    } catch (error) {
      console.log('error clear card', error.message);
    }
  }
}
