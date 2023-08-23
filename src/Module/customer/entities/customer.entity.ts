import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'customer',
})
export class Customer extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  first_name!: string;

  @Column({
    type: DataType.STRING(100),
  })
  last_name!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
  })
  username?: string;

  @Column({
    field: 'country_code',
    allowNull: true,
    type: DataType.STRING(10),
  })
  country_code?: string;

  @Column({
    type: DataType.STRING(100),
  })
  phone!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
  })
  email?: string;

  @Column({
    type: DataType.STRING(200),
  })
  password!: string;

  @Column({
    allowNull: true,
    type: DataType.DATEONLY,
  })
  birth_date?: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  birth_place?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  gender: string;

  @Column({ allowNull: true, type: DataType.STRING })
  bank: string;

  @Column({ allowNull: true, type: DataType.STRING })
  bank_account_number: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  default_address: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  listing_address: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
