import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { EventTimeslot } from './eventTimeslot.entity';
import { EventCategory } from '@/Module/eventCategory/entities/eventCategory.entity';
import { EventTicket } from './eventTicket.entity';
import { EventForm } from './eventForm.entity';

@Table({
  tableName: 'event',
})
export class Event extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @ForeignKey(() => EventCategory)
  @Column({ allowNull: false, type: DataType.INTEGER })
  event_category_id: number;

  @BelongsTo(() => EventCategory)
  category: EventCategory;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  image: string;

  @Column({ allowNull: false, type: DataType.STRING(10) })
  type: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  online_address: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  offline_address: string;

  @Column({ allowNull: true, type: DataType.STRING(100) })
  hashtags: string;

  @Column({ allowNull: false, type: DataType.TINYINT, defaultValue: 1 })
  status: string;

  @Column({ allowNull: false, type: DataType.TINYINT, defaultValue: 0 })
  is_published: string;

  @HasMany(() => EventTimeslot)
  timeslots: EventTimeslot[];

  @HasMany(() => EventTicket)
  tickets: EventTicket[];

  @HasMany(() => EventForm)
  forms: EventForm[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
