import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './entities/book.entity.js';
import { Category } from '../categories/entities/category.entity.js';

import { CreateBookDto } from './dto/create-book.dto.js';
import { BookResponseDto } from './dto/book-response.dto.js';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 실습 1: ORM으로 전체 도서 조회
  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      relations: {
        category: true,
      },
      order: {
        bookId: 'DESC',
      },
    });

    return books.map((book) => BookResponseDto.from(book));
  }

  // 실습 2
  async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
    // 1. categoryId가 실제로 존재하는지 확인
    const category = await this.categoryRepository.findOne({
      where: {
        categoryId: dto.categoryId,
      },
    });

    // 2. 존재하지 않는 categoryId면 오류
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }

    // 3. Book Entity 생성
    const book = this.bookRepository.create({
      category,
      title: dto.title,
      description: dto.description ?? null,
    });

    // 4. DB에 저장
    const savedBook = await this.bookRepository.save(book);

    // 5. 응답 DTO로 변환
    return BookResponseDto.from(savedBook);
  }

  async getBooksByCategory(categoryId: number): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      where: {
        category: {
          categoryId: categoryId,
        },
      },
      relations: {
        category: true,
      },
    });

    return books.map((book) => BookResponseDto.from(book));
  }
}
