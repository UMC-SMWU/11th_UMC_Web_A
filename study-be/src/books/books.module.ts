import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Category])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}