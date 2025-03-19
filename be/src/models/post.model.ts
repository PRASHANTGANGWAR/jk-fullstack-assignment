import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'posts' })
export class Post extends Model {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
    })
    id: number;

    @ForeignKey(() => User) // Define foreign key reference
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id: number;
    @BelongsTo(() => User) // Define relation with User
    user: User;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    body: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    image: string
}
