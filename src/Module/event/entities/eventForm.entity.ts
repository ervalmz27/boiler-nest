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
  tableName: 'event_form',
})
export class EventForm extends Model {
  @ForeignKey(() => Event)
  @Column({ allowNull: false, type: DataType.INTEGER })
  event_id: number;

  @BelongsTo(() => Event)
  event: Event;

  @Column({ allowNull: false, type: DataType.STRING })
  type: string;

  @Column({ allowNull: false, type: DataType.SMALLINT, defaultValue: 0 })
  is_required: number;

  @Column({ allowNull: false, type: DataType.STRING })
  required_by: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  question: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  options: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
