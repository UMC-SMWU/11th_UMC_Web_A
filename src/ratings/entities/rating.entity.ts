import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Member } from '../../members/entities/member.entity.js';

@Entity('rating')
@Unique(['member', 'movieId'])
export class Rating {
  @PrimaryGeneratedColumn({
    name: 'rating_id',
    type: 'bigint',
  })
  ratingId: number;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'movie_id', type: 'bigint' })
  movieId: number;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string | null;
}
