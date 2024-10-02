import { BaseEntity } from 'src/entities/base.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('blogs')
export class Blog extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Link the userId column as a foreign key
  user: UserEntity;
}
