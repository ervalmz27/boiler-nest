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
import { CouponTier } from './couponTier.entity';

@Table({
  tableName: 'coupon',
})
export class Coupon extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  category: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  category_birthday_month: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  expiry: number;

  @Column({ allowNull: true, type: DataType.TEXT })
  coupon_type: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  amount: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  product_id: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  minimum_spend: number;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: true, type: DataType.DATEONLY })
  campaign_start: Date;

  @Column({ allowNull: true, type: DataType.DATEONLY })
  campaign_end: Date;

  @HasMany(() => CouponTier)
  tiers: CouponTier[];

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'ALL' })
  apply_to: string;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
