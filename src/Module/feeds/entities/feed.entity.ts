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
  tableName: 'feed',
})
export class Feeds extends Model {
  @Column({ allowNull: false, type: DataType.TEXT })
  content: string;

  @Column({ allowNull: true, type: DataType.INTEGER, defaultValue: 1 })
  status: number;

  @CreatedAt
  crt_datetime: Date;

  @UpdatedAt
  upd_datetime: Date;

  @DeletedAt
  del_datetime: Date;
}
