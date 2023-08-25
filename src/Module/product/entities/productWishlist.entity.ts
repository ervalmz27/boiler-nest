import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Product } from './product.entity';
import { Customer } from '@/Module/customer/entities/customer.entity';

@Table({
  tableName: 'product_wishlist',
})
export class ProductWishlist extends Model {
  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Customer)
  @Column({ allowNull: true, type: DataType.INTEGER })
  customer_id: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
