// src/book.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { BookService } from './book.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { BookResponseDto } from './dto/book-response.dto.js';

@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // (BookService)을 주입받습니다.
  constructor(private readonly bookService: BookService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  // POST http://localhost:3000/books
  @Post()
  async createBook(@Body() body: CreateBookDto): Promise<BookResponseDto> {
    return this.bookService.createBook(body);
  }

  //GET http://localhost:3000/books/category/1
  @Get('category/:categoryId')
  async getBooksByCategory(@Param('categoryId') categoryId: string) {
    return this.bookService.getBooksByCategory(Number(categoryId));
  }
}
