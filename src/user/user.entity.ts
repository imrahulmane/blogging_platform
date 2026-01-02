import { Blog } from 'src/blogs/entities/blog.entity';
import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 0 })
  token_version: number;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];
}
