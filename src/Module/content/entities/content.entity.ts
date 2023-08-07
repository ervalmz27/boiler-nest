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
  tableName: 'content',
})
export class Content extends Model {
  @Column({ allowNull: false, type: DataType.STRING })
  page_type: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  content: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  content_zh: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
