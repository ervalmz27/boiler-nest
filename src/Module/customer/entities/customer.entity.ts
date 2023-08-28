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
import { CustomerBank } from './customerBank entity';

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

  @Column({ allowNull: true, type: DataType.TEXT })
  default_address: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  listing_address: string;

  @HasMany(() => CustomerBank)
  banks: CustomerBank[];

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
