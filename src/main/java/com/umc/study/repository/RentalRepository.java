package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public void save(Map<String, Object> body) {
        // rental_id는 AUTO_INCREMENT, returned_at은 반납 전이라 NULL로 둠
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) " +
                "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";

        jdbcTemplate.update(
                sql,
                body.get("userId"),
                body.get("bookId")
        );
    }

    // 반납 처리
    public int updateReturnedAt(Long rentalId) {
        // returned_at IS NULL 조건 → 이미 반납된 건 다시 반납 처리 안 되게 막음
        String sql = "UPDATE rental SET returned_at = NOW() " +
                "WHERE rental_id = ? AND returned_at IS NULL";

        // update()는 영향받은 행 개수를 리턴함
        return jdbcTemplate.update(sql, rentalId);
    }
}