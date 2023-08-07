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

@Table({
  tableName: 'product_media',
})
export class ProductMedia extends Model {
  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  product_id: number;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  type: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  path: string;

  @Column({ allowNull: false, type: DataType.SMALLINT, defaultValue: 0 })
  is_cover: number;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 1 })
  order_no: number;

  @BelongsTo(() => Product)
  product: Product;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
