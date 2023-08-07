import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Event } from './event.entity';

@Table({
  tableName: 'event_ticket',
})
export class EventTicket extends Model {
  @ForeignKey(() => Event)
  @Column({ allowNull: false, type: DataType.INTEGER })
  event_id: number;

  @Column({ allowNull: false, type: DataType.STRING })
  name: string;

  @Column({ allowNull: false, type: DataType.DECIMAL(25, 2), defaultValue: 1 })
  price: number;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 1 })
  total_ticket: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
