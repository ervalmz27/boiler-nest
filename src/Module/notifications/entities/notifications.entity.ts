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
  tableName: 'notifications',
})
export class Notifications extends Model {
  @Column({ allowNull: true, type: DataType.STRING(20) })
  type: string;

  @Column({ allowNull: true, type: DataType.STRING(100) })
  destination: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  content: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  response: string;

  @Column({ allowNull: true, type: DataType.STRING(20) })
  status: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  extra_details: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
