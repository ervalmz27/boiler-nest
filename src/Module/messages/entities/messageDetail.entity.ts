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
} from 'sequelize-typescript';
import { Messages } from './messages.entity';
import { Member } from '@/Module/member/entities/member.entity';

@Table({
  tableName: 'message_details',
})
export class MessageDetails extends Model {
  @ForeignKey(() => Messages)
  @Column({ allowNull: true, type: DataType.INTEGER })
  message_id: number;

  @BelongsTo(() => Messages)
  message: Messages;

  @ForeignKey(() => Member)
  @Column({ allowNull: true, type: DataType.INTEGER })
  member_id: number;

  @BelongsTo(() => Member)
  member: Member;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
  })
  phone: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  photo: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  message_content: string;

  @Column({ allowNull: false, type: DataType.DATE })
  send_at: string;

  @Column({ allowNull: true, type: DataType.DATE })
  last_send_at: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  remarks: string;

  @Column({ allowNull: true, type: DataType.STRING })
  sender_id: string;

  @Column({ allowNull: true, type: DataType.TEXT, defaultValue: 'DRAFT' })
  publish_status: string;

  @Column({
    allowNull: true,
    type: DataType.ENUM(
      'PENDING',
      'FAILED',
      'SUCCESS',
      'CANCELED',
      'WAITING_STATUS',
      'UNKNOWN',
    ),
  })
  status: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
