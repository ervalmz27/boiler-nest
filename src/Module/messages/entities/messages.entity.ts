import { MemberTier } from '@/Module/memberTier/entities/memberTier.entity';
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
  HasMany,
} from 'sequelize-typescript';
import { MessageDetails } from './messageDetail.entity';

@Table({
  tableName: 'messages',
})
export class Messages extends Model {
  @Column({ allowNull: false, type: DataType.DATE })
  send_at: string;

  @Column({ allowNull: true, type: DataType.STRING(100) })
  title: string;

  @Column({ allowNull: true, type: DataType.STRING(100) })
  send_to: string;

  // @ForeignKey(() => MemberTier)
  // @Column({ allowNull: true, type: DataType.INTEGER })
  // tier_id: number;

  @Column({ allowNull: true, type: DataType.TEXT })
  tiers: string;

  // @BelongsTo(() => MemberTier)
  // tier: MemberTier;

  @Column({ allowNull: true, type: DataType.TEXT })
  message: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  image: string;

  @Column({ allowNull: true, type: DataType.ENUM('DRAFT', 'PUBLISHED') })
  status: string;

  @HasMany(() => MessageDetails)
  details: MessageDetails[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
