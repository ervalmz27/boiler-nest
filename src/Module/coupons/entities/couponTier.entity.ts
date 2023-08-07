import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Coupon } from './coupon.entity';
import { MemberTier } from '@/Module/memberTier/entities/memberTier.entity';

@Table({
  tableName: 'coupon_tiers',
})
export class CouponTier extends Model {
  @ForeignKey(() => Coupon)
  @Column({ allowNull: false, type: DataType.INTEGER })
  coupon_id: number;

  @BelongsTo(() => Coupon)
  coupon: Coupon;

  @ForeignKey(() => MemberTier)
  @Column({ allowNull: false, type: DataType.INTEGER })
  tier_id: number;

  @BelongsTo(() => MemberTier)
  tier: MemberTier;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
