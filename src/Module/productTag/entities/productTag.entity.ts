import { Product } from '@/Module/product/entities/product.entity';
import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'product_tag',
  timestamps: false,
})
export class ProductTag extends Model {
  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;
}
