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
  tableName: 'users',
})
export class User extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: true, type: DataType.STRING(50) })
  username: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  email: string;

  @Column({ allowNull: false, type: DataType.STRING(100) })
  password: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
