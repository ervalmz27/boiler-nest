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
  tableName: 'voucher',
})
export class Voucher extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  photo: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  point_required: number;

  @Column({ allowNull: true, type: DataType.STRING })
  type: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  amount: number;

  @Column({ allowNull: true, type: DataType.INTEGER, defaultValue: 0 })
  expire_in_hour: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  minimum_spend: number;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  term_condition: string;

  @Column({ allowNull: true, type: DataType.STRING, defaultValue: 'ALL' })
  apply_to: string;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
