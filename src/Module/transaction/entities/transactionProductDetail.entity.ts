import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from '@/Module/product/entities/product.entity';
import { ProductOption } from '@/Module/product/entities/productOption.entity';
import { Transaction } from './transaction.entity';

@Table({
  tableName: 'transaction_product_detail',
})
export class TransactionProductDetail extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Transaction)
  @Column({ allowNull: false, type: DataType.UUID })
  transaction_id: string;

  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => ProductOption)
  @Column({ allowNull: false, type: DataType.INTEGER })
  product_option_id: number;

  @BelongsTo(() => ProductOption)
  product_option: ProductOption;

  @Column({ allowNull: false, type: DataType.INTEGER })
  qty: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  original_price: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  price: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  subtotal: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
