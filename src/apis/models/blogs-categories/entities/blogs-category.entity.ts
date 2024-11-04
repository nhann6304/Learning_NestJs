import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../users/user.entity";

@Entity("blogs_categories")
export class BlogsCategoryEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    bc_name: string;

    @ManyToOne(() => UserEntity, (user) => user.blogs)
    author: UserEntity
}
