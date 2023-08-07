import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'article_category',
})
export class ArticleCategory extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: true, type: DataType.STRING(50) })
  name_zh: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description_zh: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
