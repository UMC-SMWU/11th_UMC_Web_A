package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // 메서드 이름이 곧 쿼리다. => SELECT ... FROM book ORDER BY book_id DESC
    // @EntityGraph: 카테고리를 JOIN으로 한 번에 가져와서, 책마다 카테고리를 따로 조회하는 N+1 쿼리를 막는다.
    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();

    // [3주차 미션 1을 ORM으로] 특정 카테고리의 도서 조회 (category.categoryId 기준)
    @EntityGraph(attributePaths = "category")
    List<Book> findByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);

    // [선택 심화 2] 제목 검색 => WHERE title LIKE %keyword%
    @EntityGraph(attributePaths = "category")
    List<Book> findByTitleContainingOrderByBookIdDesc(String keyword);
}
