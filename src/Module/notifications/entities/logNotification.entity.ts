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
  tableName: 'log_notification',
})
export class LogNotification extends Model {
  @Column({ allowNull: true, type: DataType.STRING(100) })
  service_sender: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  payload: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  response: string;

  @Column({ allowNull: true, type: DataType.SMALLINT })
  is_success: number;

  @Column({ allowNull: true, type: DataType.STRING })
  statusCode: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
