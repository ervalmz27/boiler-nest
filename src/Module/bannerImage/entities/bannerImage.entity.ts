import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'banner_images',
})
export class BannerImage extends Model {
  @Column({ allowNull: false, type: DataType.TEXT })
  image_url: string;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  order: number;

  @Column({ allowNull: true, type: DataType.SMALLINT, defaultValue: 1 })
  is_published: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
