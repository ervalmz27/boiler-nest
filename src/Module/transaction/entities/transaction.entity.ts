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
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { TransactionDetail } from './transactionProductDetail.entity';

@Table({
  tableName: 'transaction',
})
export class Transaction extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Customer)
  @Column({ allowNull: true, type: DataType.INTEGER })
  customer_id: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @Column({ allowNull: true, type: DataType.DATEONLY })
  order_date: string;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'ORDER' })
  type: string;

  // Location only between HK or CN (China)
  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'HK' })
  location: string;

  @Column({ allowNull: true, type: DataType.STRING })
  order_number: string;

  @Column({ allowNull: true, type: DataType.STRING })
  remarks: string;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'HKD' })
  currency: string;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'CUSTOM' })
  payment_method: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  payment_detail: string;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'PENDING' })
  payment_status: string;

  @Column({ allowNull: true, type: DataType.STRING })
  recipient_firstname: string;

  @Column({ allowNull: true, type: DataType.STRING })
  recipient_lastname: string;

  @Column({ allowNull: true, type: DataType.STRING })
  recipient_phone: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_address?: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_address2?: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_address3?: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_address4?: string;

  @Column({ allowNull: true, type: DataType.STRING })
  delivery_district: string;

  @Column({ allowNull: true, type: DataType.STRING })
  delivery_region: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_remark: string;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'PENDING' })
  delivery_status: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  discount: number;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'PENDING' })
  status: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  subtotal: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  disc: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  total_delivery: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  total: number;

  @HasMany(() => TransactionDetail)
  products: TransactionDetail[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
