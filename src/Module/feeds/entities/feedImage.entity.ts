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
  tableName: 'feed_image',
})
export class FeedImage extends Model {
  @ForeignKey(() => Feeds)
  @Column({ allowNull: false, type: DataType.INTEGER })
  feed_id: number;

  @BelongsTo(() => Feeds)
  feed: Feeds;

  @Column({ allowNull: false, type: DataType.STRING })
  image_path: string;

  @CreatedAt
  crt_datetime: Date;

  @UpdatedAt
  upd_datetime: Date;
}
