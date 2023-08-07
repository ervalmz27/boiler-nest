import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Event } from './event.entity';

@Table({
  tableName: 'event_timeslot',
})
export class EventTimeslot extends Model {
  @ForeignKey(() => Event)
  @Column({ allowNull: false, type: DataType.INTEGER })
  event_id: number;

  @BelongsTo(() => Event)
  event: Event;

  @Column({ allowNull: true, type: DataType.DATE })
  start_date: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  end_date: Date;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 1 })
  total_ticket: string;

  @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 1 })
  total_participant: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
