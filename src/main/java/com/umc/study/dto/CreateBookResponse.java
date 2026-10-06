package com.umc.study.dto;

import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Transactional
public BookResponse createBook(CreateBookRequest request) {
    Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

    Book book = new Book(category, request.title(), request.description());
    return BookResponse.from(bookRepository.save(book));
}

@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public BookResponse createBook(@Valid @RequestBody CreateBookRequest request) {
    return bookService.createBook(request);
}