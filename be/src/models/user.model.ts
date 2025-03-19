import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Post } from './post.model';

@Table({ tableName: 'users' })
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.STRING(40),
    allowNull: true,
  })
  first_name: string;

  @Column({
    type: DataType.STRING(40),
    allowNull: true,
  })
  last_name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
  })
  phone_number: string;

  @HasMany(() => Post) // Define One-to-Many relation
  posts: Post[];
}
