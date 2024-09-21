import { BaseEntity } from "src/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity('users') 
export class UserEntity extends BaseEntity {
    @Column()
    username: string

    @Column({unique: true})
    email: string

    @Column()
    password: string

}