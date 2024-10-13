import { IUser } from "src/interfaces/common/user.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    // @Column()
    // refreshToken: string;
}
