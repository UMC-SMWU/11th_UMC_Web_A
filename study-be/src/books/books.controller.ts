import { Body, Controller, Get, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookResponseDto } from './dto/book-response.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks(): Promise<BookResponseDto[]> {
    return this.booksService.getBooks();
  }

  @Post()
  createBook(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return this.booksService.createBook(dto);
  }
}