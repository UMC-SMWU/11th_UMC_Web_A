package com.umc.study.controller;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    // GET http://localhost:8080/books            -> 전체 (최신순)
    // GET http://localhost:8080/books?keyword=스프링 -> 제목 검색 [선택 심화 2]
    @GetMapping
    public List<BookResponse> getBooks(@RequestParam(required = false) String keyword) {
        return bookService.getBooks(keyword);
    }

    // GET http://localhost:8080/books/category/1
    @GetMapping("/category/{categoryId}")
    public List<BookResponse> getBooksByCategory(@PathVariable Long categoryId) {
        return bookService.getBooksByCategory(categoryId);
    }

    // POST http://localhost:8080/books   Body: { "categoryId": 1, "title": "...", "description": "..." }
    // @Valid: 요청 DTO의 검증 조건을 Service에 닿기 전에 확인한다.
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // 성공하면 201 Created
    public BookResponse createBook(@Valid @RequestBody CreateBookRequest request) {
        return bookService.createBook(request);
    }
}
