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
import { MemberTier } from '@/Module/memberTier/entities/memberTier.entity';
import { Member } from '../member/entities/member.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
@Table({
  tableName: 'member_point_log',
})
export class PointLog extends Model {
  @ForeignKey(() => Member)
  @Column({ allowNull: false, type: DataType.INTEGER })
  member_id: number;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })
  points: number;

  @ForeignKey(() => Transaction)
  @Column({ allowNull: true, type: DataType.UUID })
  transaction_id: number;

  @BelongsTo(() => Transaction)
  transaction: Transaction;

  @Column({ allowNull: true, type: DataType.TEXT })
  remarks: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
