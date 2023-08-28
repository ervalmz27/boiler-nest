import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Customer } from './customer.entity';

@Table({
  tableName: 'customer_bank',
  timestamps: false,
})
export class CustomerBank extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  name: string;

  @Column({
    type: DataType.STRING(100),
  })
  account_number: string;

  @ForeignKey(() => Customer)
  @Column({ allowNull: false, type: DataType.INTEGER })
  customer_id: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @Column({
    allowNull: true,
    type: DataType.SMALLINT,
    defaultValue: 0,
  })
  is_default: number;
}
