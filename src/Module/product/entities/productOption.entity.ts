import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from './product.entity';

@Table({
  tableName: 'product_option',
})
export class ProductOption extends Model {
  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  product_id: number;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: false, type: DataType.STRING(10), defaultValue: 'HKD' })
  currency: string;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })
  quantity: number;

  @Column({ allowNull: false, type: DataType.DECIMAL(25, 2) })
  list_price: number;

  @Column({ allowNull: false, type: DataType.DECIMAL(25, 2) })
  selling_price: number;

  @Column({ allowNull: false, type: DataType.STRING(20) })
  weight: string;

  @Column({ allowNull: false, type: DataType.STRING(10), defaultValue: 'KG' })
  weight_unit: string;

  @BelongsTo(() => Product)
  product: Product;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
