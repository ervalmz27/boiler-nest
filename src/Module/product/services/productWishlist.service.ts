import { Op } from 'sequelize';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  PRODUCT_COLLECTION_PROVIDER,
  PRODUCT_WISHLIST_PROVIDER,
} from '@/Helpers/contants';
import { ProductWishlist } from '../entities/productWishlist.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductWishlistService {
  private readonly logger = new Logger(ProductWishlistService.name);

  constructor(
    @Inject(PRODUCT_WISHLIST_PROVIDER)
    private readonly repository: typeof ProductWishlist,
  ) {}

  async getWishListByCustomer(customer_id) {
    return this.repository.findAll({
      where: {
        customer_id,
      },
      include: [{ model: Product, attributes: ['name'] }],
    });
  }

  async deleteCustomerWishlist(id, customer_id) {
    return this.repository.destroy({
      where: {
        id: id,
        customer_id: customer_id,
      },
    });
  }
}
