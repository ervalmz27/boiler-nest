import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from '@/Module/product/entities/product.entity';
import { ProductOption } from '@/Module/product/entities/productOption.entity';
import { Transaction } from './transaction.entity';
import { Event } from '@/Module/event/entities/event.entity';
import { EventTimeslot } from '@/Module/event/entities/eventTimeslot.entity';
import { EventTicket } from '@/Module/event/entities/eventTicket.entity';

@Table({
  tableName: 'transaction_event',
})
export class TransactionEvent extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Transaction)
  @Column({ allowNull: false, type: DataType.UUID })
  transaction_id: string;

  @BelongsTo(() => Transaction)
  transaction: Transaction;

  @ForeignKey(() => Event)
  @Column({ allowNull: false, type: DataType.INTEGER })
  event_id: number;

  @BelongsTo(() => Event)
  event: Event;

  @ForeignKey(() => EventTimeslot)
  @Column({ allowNull: false, type: DataType.INTEGER })
  event_timeslot_id: number;

  @BelongsTo(() => EventTimeslot)
  event_timeslot: EventTimeslot;

  @ForeignKey(() => EventTicket)
  @Column({ allowNull: false, type: DataType.INTEGER })
  event_ticket_id: number;

  @BelongsTo(() => EventTicket)
  event_ticket: EventTicket;

  @Column({ allowNull: false, type: DataType.INTEGER })
  qty: number;

  @Column({ allowNull: false, type: DataType.TEXT })
  participants_data: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  price: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(25, 2), defaultValue: 0 })
  subtotal: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
