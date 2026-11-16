import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('member')
@Unique(['email'])
@Unique(['nickname'])
export class Member {
  @PrimaryGeneratedColumn({
    name: 'member_id',
    type: 'bigint',
  })
  memberId: number;

  @Column({ length: 254 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ length: 50 })
  nickname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
