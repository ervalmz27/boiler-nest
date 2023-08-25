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
  tableName: 'transaction_log',
})
export class TransactionLog extends Model {
  @ForeignKey(() => Transaction)
  @Column({ allowNull: false, type: DataType.UUID })
  transaction_id: string;

  @Column({ allowNull: false, type: DataType.TEXT, defaultValue: 'general' })
  type: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  log: string;

  @CreatedAt
  created_at: Date;
}
