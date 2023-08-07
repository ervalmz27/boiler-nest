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
import { FeedComment } from './feedComment.entity';

@Table({
  tableName: 'feed_comment_spam',
})
export class FeedCommentReportSpam extends Model {
  @ForeignKey(() => FeedComment)
  @Column({ allowNull: false, type: DataType.INTEGER })
  feed_comment_id: number;

  @BelongsTo(() => FeedComment)
  feed_comment: FeedComment;

  @Column({ allowNull: false, type: DataType.INTEGER })
  user_id: number;

  @CreatedAt
  crt_datetime: Date;

  @UpdatedAt
  upd_datetime: Date;
}
