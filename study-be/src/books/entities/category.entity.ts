import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column()
  name: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}