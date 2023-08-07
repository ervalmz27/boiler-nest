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
  tableName: 'user',
})
export class Users extends Model {
  // @ForeignKey(() => UserTier)
  // @Column({ allowNull: false, type: DataType.INTEGER })
  // tier_id: number;

  // @BelongsTo(() => UserTier)
  // tier: UserTier;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: false, type: DataType.STRING })
  username: string;

  @Column({ allowNull: false, type: DataType.STRING })
  country_code: string;

  @Column({ allowNull: false, type: DataType.STRING })
  phone: string;

  @Column({ allowNull: false, type: DataType.STRING })
  email: string;

  @Column({ allowNull: false, type: DataType.STRING })
  password: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  address: string;

  @Column({ allowNull: false, type: DataType.DATE })
  birth_date: string;

  @Column({ allowNull: false, type: DataType.STRING })
  photo: string;

  @Column({ allowNull: false, type: DataType.STRING })
  token: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_address: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_address2: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_district: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  delivery_region: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
