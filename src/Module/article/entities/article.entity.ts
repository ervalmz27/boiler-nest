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
import { ArticleCategory } from '@/Module/articleCategory/entities/articleCategory.entity';

@Table({
  tableName: 'article',
})
export class Article extends Model {
  @ForeignKey(() => ArticleCategory)
  @Column({ allowNull: false, type: DataType.INTEGER })
  article_category_id: number;

  @BelongsTo(() => ArticleCategory)
  article_category: ArticleCategory;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  title: string;

  @Column({ allowNull: true, type: DataType.STRING(50) })
  title_zh: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  thumbnail: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  content: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  content_zh: string;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  status: number;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  send_notification: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
