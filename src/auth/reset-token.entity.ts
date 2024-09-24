import { BaseEntity } from "src/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity('reset_tokens')
export class ResetTokenEntity extends BaseEntity{
    @Column()
    token:  string;

    @Column()
    user_id:  number;

    @Column('timestamp')
    expires_in:  Date;
}