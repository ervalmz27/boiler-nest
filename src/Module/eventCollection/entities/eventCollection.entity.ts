import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { EventCollectionItem } from './eventCollectionItem.entity';

@Table({
  tableName: 'event_collection',
})
export class EventCollection extends Model {
  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  order: number;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  is_published: number;

  @HasMany(() => EventCollectionItem)
  events: EventCollectionItem[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
