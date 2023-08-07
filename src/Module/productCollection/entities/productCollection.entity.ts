import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { ProductCollectionItem } from './productCollectionItem.entity';

@Table({
  tableName: 'product_collection',
})
export class ProductCollection extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  image: string;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  is_published: number;

  @HasMany(() => ProductCollectionItem)
  items: ProductCollectionItem[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
