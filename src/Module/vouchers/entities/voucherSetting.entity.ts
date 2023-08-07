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
  tableName: 'voucher_setting',
})
export class VoucherSetting extends Model {
  @Column({ allowNull: false, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  spend_amount: number;

  @Column({ allowNull: false, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  reward_amount: number;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
