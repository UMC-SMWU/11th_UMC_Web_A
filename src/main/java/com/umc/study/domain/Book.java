package com.umc.study.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// book 테이블 한 행 = Book 객체 하나
@Entity
@Table(name = "book")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long bookId;

    // 도서 여러 권은 하나의 카테고리에 속한다 (category 1 : N book).
    // category_id 숫자만 들고 다니는 대신 Category 객체로 관계를 표현한다.
    // LAZY: 책을 읽을 때 카테고리는 실제로 쓸 때까지 가져오지 않는다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // DB의 snake_case 컬럼(is_available)과 코드의 camelCase 필드(isAvailable)를 명시적으로 연결한다.
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    // 새 도서 등록용 생성자. 대여 가능 여부는 항상 true로 시작한다.
    public Book(Category category, String title, String description) {
        this.category = category;
        this.title = title;
        this.description = description;
    }
}
