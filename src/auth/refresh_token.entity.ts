import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
  @Column()
  token: string;

  @Column()
  user_id: number;

  @Column('timestamp')
  expires_in: Date;
}
