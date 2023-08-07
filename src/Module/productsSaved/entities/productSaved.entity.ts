import { Member } from '@/Module/member/entities/member.entity';
import { Product } from '@/Module/product/entities/product.entity';
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

@Table({
  tableName: 'product_saved',
})
export class ProductSaved extends Model {
  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Member)
  @Column({ allowNull: false, type: DataType.INTEGER })
  member_id: string;

  @BelongsTo(() => Member)
  member: Member;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
