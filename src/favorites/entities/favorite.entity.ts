import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Member } from '../../members/entities/member.entity.js';

@Entity('favorite')
@Unique(['member', 'movieId'])
export class Favorite {
  @PrimaryGeneratedColumn({
    name: 'favorite_id',
    type: 'bigint',
  })
  favoriteId: number;

  @Column({
    name: 'movie_id',
    type: 'bigint',
  })
  movieId: number;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date;
}
