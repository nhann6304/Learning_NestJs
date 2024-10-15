import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("token")

export class TokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Column()
    user_id: string


    @Column()
    accessToken: string

    @Column({ default: false })
    isRefreshToken: boolean

}