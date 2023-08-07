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
import { MemberTier } from '@/Module/memberTier/entities/memberTier.entity';
import { PointLog } from '@/Module/pointLog/pointLog.entity';

@Table({
  tableName: 'member',
})
export class Member extends Model {
  @ForeignKey(() => MemberTier)
  @Column({ allowNull: false, type: DataType.INTEGER })
  tier_id: number;

  @BelongsTo(() => MemberTier)
  tier: MemberTier;

  @Column({
    allowNull: true,
    type: DataType.STRING(20),
  })
  member_no!: string;

  @Column({
    type: DataType.STRING(100),
  })
  name!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
  })
  username?: string;

  @Column({
    field: 'country_code',
    allowNull: true,
    type: DataType.STRING(10),
  })
  country_code?: string;

  @Column({
    type: DataType.STRING(100),
  })
  phone!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
  })
  email?: string;

  @Column({
    type: DataType.STRING(200),
  })
  password!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  address?: string;

  @Column({
    allowNull: true,
    type: DataType.DATEONLY,
  })
  birth_date?: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  photo?: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  delivery_address?: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  delivery_address2?: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  delivery_address3?: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  delivery_address4?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(200),
  })
  delivery_district?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(200),
  })
  delivery_region?: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  token?: string;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })
  points: number;

  @HasMany(() => PointLog)
  point_logs: PointLog[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
