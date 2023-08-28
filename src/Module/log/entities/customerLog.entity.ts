import { Customer } from '@/Module/customer/entities/customer.entity';
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

@Table({
  tableName: 'log_customer',
})
export class LogCustomer extends Model {
  @ForeignKey(() => Customer)
  @Column({ allowNull: true, type: DataType.INTEGER })
  customer_id: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @Column({ allowNull: false, type: DataType.TEXT })
  log: string;

  @CreatedAt
  created_at: Date;
}
