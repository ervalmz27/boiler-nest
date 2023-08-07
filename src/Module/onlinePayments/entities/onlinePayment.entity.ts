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
  tableName: 'payment_online',
})
export class OnlinePayment extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: false, type: DataType.STRING })
  type: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  image: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  public_key: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  secret_key: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  webhook_secret: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  merchant_key: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  client_id: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  signing_key_id: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  signing_key: string;

  @Column({ allowNull: true, type: DataType.STRING })
  environment: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  fee_amount: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  fee_percentage: number;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
