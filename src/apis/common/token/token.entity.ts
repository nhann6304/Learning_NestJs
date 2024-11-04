import { UserEntity } from 'src/apis/models/users/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('token')
export class TokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column()
    @OneToOne(() => UserEntity, { cascade: true })
    @JoinColumn({ name: 'user_id' })
    user_id: string;

    @Column()
    accessToken: string;

    @Column({ default: false })
    isRefreshToken: boolean;
}
