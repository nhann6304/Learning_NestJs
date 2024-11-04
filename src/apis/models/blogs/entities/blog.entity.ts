import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogsCategoryEntity } from '../../blogs-categories/entities/blogs-category.entity';

@Entity('blogs')
export class BlogsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    blogName: string;

    @Column()
    content: string;

    @ManyToOne(() => BlogsCategoryEntity, (bc) => bc.id, { cascade: true })
    blog_category: BlogsCategoryEntity | string;
}
