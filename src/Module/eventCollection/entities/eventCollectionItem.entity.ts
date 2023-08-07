import {
  Column,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { EventCollection } from './eventCollection.entity';
import { Event } from '@/Module/event/entities/event.entity';

@Table({
  tableName: 'event_collection_item',
})
export class EventCollectionItem extends Model {
  @ForeignKey(() => EventCollection)
  @Column({ allowNull: false, type: DataType.INTEGER })
  event_collection_id: number;

  @ForeignKey(() => Event)
  @Column({ allowNull: false, type: DataType.INTEGER })
  event_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
