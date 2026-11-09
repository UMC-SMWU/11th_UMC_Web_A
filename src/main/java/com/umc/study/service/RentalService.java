package com.umc.study.service;

import com.umc.study.exception.RentalAlreadyReturnedException;
import com.umc.study.exception.RentalNotFoundException;
import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public Long createRental(Long userId, Long bookId) {
        return rentalRepository.save(userId, bookId);
    }

    // 반납 쿼리는 아직 반납하지 않은 기록(returned_at IS NULL)만 바꾼다.
    // 바뀐 행이 0이면 두 경우다: 대여 기록이 없거나(404), 이미 반납했다(409).
    public void returnRental(Long rentalId) {
        if (rentalRepository.updateReturnedAt(rentalId) > 0) {
            return;
        }
        if (!rentalRepository.existsById(rentalId)) {
            throw new RentalNotFoundException(rentalId);
        }
        throw new RentalAlreadyReturnedException(rentalId);
    }
}
