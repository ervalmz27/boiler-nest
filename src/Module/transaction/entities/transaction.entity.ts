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
import { TransactionProductDetail } from './transactionProductDetail.entity';

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
  @Column({ allowNull: false, type: DataType.INTEGER })
  customer_id: number;

  @BelongsTo(() => Customer)
  member: Customer;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'ORDER' })
  type: string;

  @Column({ allowNull: true, type: DataType.STRING })
  order_number: string;

  @Column({ allowNull: false, type: DataType.STRING })
  contact_firstname: string;

  @Column({ allowNull: false, type: DataType.STRING })
  contact_lastname: string;

  @Column({ allowNull: false, type: DataType.STRING })
  contact_email: string;

  @Column({ allowNull: false, type: DataType.STRING })
  contact_phone: string;

  @Column({ allowNull: true, type: DataType.STRING })
  remarks: string;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'HKD' })
  currency: string;

  @Column({ allowNull: false, type: DataType.STRING, defaultValue: 'CUSTOM' })
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

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_remark_admin: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_message: string;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'PENDING' })
  delivery_status: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  selfpickup_name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  selfpickup_phone: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  selfpickup_email: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  member_coupon_id: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  coupon_id: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 5), defaultValue: 0 })
  coupon_discount: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  coupon_detail: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  discount_id: number;

  @Column({ allowNull: true, type: DataType.TEXT })
  discount_code: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  discount_detail: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  payer_answers: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  total_discount_tier: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  total_discount_code: number;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'PENDING' })
  status: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  subtotal_product: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  subtotal_event: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  total_discount: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  total_delivery: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  total: number;

  @Column({ allowNull: true, type: DataType.INTEGER, defaultValue: 0 })
  points: number;

  @HasMany(() => TransactionProductDetail)
  products: TransactionProductDetail[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
