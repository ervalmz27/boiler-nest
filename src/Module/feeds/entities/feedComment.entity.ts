import { Users } from '@/Module/users/entities/user.entity';
import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Feeds } from './feed.entity';

@Table({
  tableName: 'feed_comment_like',
})
export class FeedComment extends Model {
  @BelongsTo(() => Users)
  user: Users;

  @ForeignKey(() => Users)
  @Column({ allowNull: false, type: DataType.INTEGER })
  user_id: number;

  @ForeignKey(() => Feeds)
  @Column({ allowNull: false, type: DataType.INTEGER })
  feed_id: number;

  @BelongsTo(() => Feeds)
  feed: Feeds;

  @Column({ allowNull: false, type: DataType.TEXT })
  content: string;

  @CreatedAt
  crt_datetime: Date;

  @UpdatedAt
  upd_datetime: Date;
}
