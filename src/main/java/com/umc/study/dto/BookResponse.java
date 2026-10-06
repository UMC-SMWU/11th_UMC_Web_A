package com.umc.study.dto;

import com.umc.study.domain.Book;

// 도서 응답의 약속. Entity를 그대로 내보내지 않고, 필요한 값만 골라서 내보낸다.
public record BookResponse(
        Long bookId,
        String title,
        String description,
        String categoryName,
        Boolean isAvailable
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(),
                book.getIsAvailable()
        );
    }
}
