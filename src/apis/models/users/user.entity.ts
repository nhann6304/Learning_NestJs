import { IUser } from 'src/interfaces/common/user.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogsEntity } from '../blogs/entities/blog.entity';
import { BlogsCategoryEntity } from '../blogs-categories/entities/blogs-category.entity';

@Entity('users')
export class UserEntity implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userName: string;

    @Column()
    age: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => BlogsCategoryEntity, (bc) => bc.author) // Mối quan hệ ngược lại
    blogs: BlogsCategoryEntity[];
}
