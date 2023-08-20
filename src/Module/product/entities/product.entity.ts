import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ProductMedia } from './productMedia.entity';
import { ProductOption } from './productOption.entity';
import { ProductCategory } from '@/Module/productCategory/entities/productCategory.entity';
import { ProductTag } from '@/Module/productTag/entities/productTag.entity';

@Table({
  tableName: 'product',
})
export class Product extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @ForeignKey(() => ProductCategory)
  @Column({ allowNull: false, type: DataType.INTEGER })
  category_id: number;

  @BelongsTo(() => ProductCategory)
  category: ProductCategory;

  @Column({ allowNull: true, type: DataType.TEXT })
  short_description: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  terms: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  refund_policy: string;

  @Column({ allowNull: true, type: DataType.STRING(50) })
  origins: string;

  @Column({ allowNull: false, type: DataType.INTEGER })
  stock_limit: number;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  status: number;

  @HasMany(() => ProductMedia)
  medias: ProductMedia[];

  @HasMany(() => ProductOption)
  options: ProductOption[];

  @HasMany(() => ProductTag)
  tags: ProductTag[];

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  order: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
