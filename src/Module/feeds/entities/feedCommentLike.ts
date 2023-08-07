import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Users } from '@/Module/users/entities/user.entity';

@Table({
  tableName: 'feed_comment_like',
})
export class FeedCommentLike extends Model {
  @ForeignKey(() => Users)
  @Column({ allowNull: false, type: DataType.INTEGER })
  user_id: number;

  @BelongsTo(() => Users)
  user: Users;

  @Column({ allowNull: false, type: DataType.INTEGER })
  feed_comment_id: number;

  @Column({ allowNull: false, type: DataType.INTEGER })
  parent_id: number;

  @Column({ allowNull: false, type: DataType.TEXT })
  content: string;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })
  is_admin: number;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })
  is_spam: number;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })
  status: number;

  @CreatedAt
  crt_datetime: Date;

  @UpdatedAt
  upd_datetime: Date;
}
