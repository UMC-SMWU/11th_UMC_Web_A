package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    // [미션 2] 대여 기록 생성
    // rented_at = 현재 시간, due_at = 7일 뒤. rental_id는 AUTO_INCREMENT라 적지 않는다.
    // 새로 만들어진 rental_id를 응답에 담기 위해 KeyHolder로 생성된 키를 돌려받는다.
    public Long save(Long userId, Long bookId) {
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) "
                + "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, userId);
            ps.setLong(2, bookId);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key == null ? null : key.longValue();
    }

    // [선택] 반납 처리: returned_at을 현재 시간으로 갱신. 바뀐 행 수를 돌려준다.
    // AND returned_at IS NULL: 이미 반납한 기록은 바꾸지 않아서 반납 시간이 덮어써지지 않는다.
    public int updateReturnedAt(Long rentalId) {
        String sql = "UPDATE rental SET returned_at = NOW() WHERE rental_id = ? AND returned_at IS NULL";
        return jdbcTemplate.update(sql, rentalId);
    }

    // rentalId의 대여 기록이 있는지 확인한다. (바뀐 행이 0일 때 "없음"과 "이미 반납"을 구분하려고 쓴다.)
    public boolean existsById(Long rentalId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM rental WHERE rental_id = ?", Integer.class, rentalId);
        return count != null && count > 0;
    }
}
