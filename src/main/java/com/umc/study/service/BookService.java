package com.umc.study.service;

import com.umc.study.domain.Book;
import com.umc.study.domain.Category;
import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    // [실습 1] 도서 전체 조회 (최신 등록순). keyword가 있으면 제목 검색 [선택 심화 2]
    // 읽기 전용 트랜잭션 안에서 Entity -> 응답 DTO로 바꾼다.
    @Transactional(readOnly = true)
    public List<BookResponse> getBooks(String keyword) {
        List<Book> books = (keyword == null || keyword.isBlank())
                ? bookRepository.findAllByOrderByBookIdDesc()
                : bookRepository.findByTitleContainingOrderByBookIdDesc(keyword.trim());

        return books.stream()
                .map(BookResponse::from)
                .toList();
    }

    // [3주차 미션 1을 ORM으로] 특정 카테고리의 도서 조회
    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategory_CategoryIdOrderByBookIdDesc(categoryId).stream()
                .map(BookResponse::from)
                .toList();
    }

    // [실습 2] 신규 도서 등록
    // 1) 카테고리 존재 확인 -> 없으면 CategoryNotFoundException(404)
    // 2) Book Entity 생성 후 저장 -> 3) 저장된 Entity를 응답 DTO로 변환
    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        Book book = new Book(category, request.title(), request.description());
        return BookResponse.from(bookRepository.save(book));
    }
}
