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
  tableName: 'news',
})
export class News extends Model {
  @Column({ allowNull: false, type: DataType.TEXT })
  title: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  content: string;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  is_published: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
