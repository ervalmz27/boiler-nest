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
import { Member } from './member.entity';
import { Coupon } from '@/Module/coupons/entities/coupon.entity';

@Table({
  tableName: 'member_coupon',
})
export class MemberCoupon extends Model {
  @ForeignKey(() => Member)
  @Column({ allowNull: false, type: DataType.INTEGER })
  member_id: number;

  @BelongsTo(() => Member)
  member: Member;

  @ForeignKey(() => Coupon)
  @Column({ allowNull: false, type: DataType.INTEGER })
  coupon_id: number;

  @BelongsTo(() => Coupon)
  coupon: Coupon;

  @Column({ allowNull: true, type: DataType.DATE })
  start_at: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  expired_at: Date;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    defaultValue: 'AVAILABLE',
  })
  status: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
