import { Event } from '@/Module/event/entities/event.entity';
import { Product } from '@/Module/product/entities/product.entity';
import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'cart',
})
export class Cart extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING(20),
    defaultValue: 'PRODUCT',
  })
  item_type: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  member_id: string;

  @ForeignKey(() => Product)
  @Column({ allowNull: true, type: DataType.INTEGER })
  product_id: string;

  @BelongsTo(() => Product)
  product: Product;

  @Column({ allowNull: true, type: DataType.INTEGER })
  product_option_id: string;

  @ForeignKey(() => Event)
  @Column({ allowNull: true, type: DataType.INTEGER })
  event_id: string;

  @BelongsTo(() => Event)
  event: Event;

  @Column({ allowNull: true, type: DataType.INTEGER })
  event_timeslot_id: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  event_ticket_id: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  event_detail_id: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  ticket_option_id: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  qty: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  price: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
