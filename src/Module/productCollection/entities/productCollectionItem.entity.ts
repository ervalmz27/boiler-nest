import {
  Column,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { ProductCollection } from './productCollection.entity';
import { Product } from '@/Module/product/entities/product.entity';

@Table({
  tableName: 'product_collection_item',
})
export class ProductCollectionItem extends Model {
  @ForeignKey(() => ProductCollection)
  @Column({ allowNull: false, type: DataType.INTEGER })
  product_collection_id: number;

  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  product_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
