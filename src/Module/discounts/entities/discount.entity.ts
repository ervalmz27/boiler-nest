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
  tableName: 'discount',
})
export class Discount extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  code: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: true, type: DataType.STRING(50) })
  type: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  amount: number;

  @Column({ allowNull: true, type: DataType.DATE })
  start_at: string;

  @Column({ allowNull: true, type: DataType.DATE })
  end_at: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  minimum_spend: number;

  @Column({ allowNull: true, type: DataType.TEXT })
  hashtags: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: true, type: DataType.STRING(20) })
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
