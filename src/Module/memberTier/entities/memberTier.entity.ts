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
  tableName: 'member_tier',
})
export class MemberTier extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(50),
    defaultValue: 'PERCENTAGE',
  })
  type: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  amount: number;

  @Column({ allowNull: true, type: DataType.TEXT })
  excluded_hashtags: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })
  is_default: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
