package com.umc.study.service;

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

    // 바뀐 행이 0이면 해당 rentalId의 대여 기록이 없다는 뜻
    public boolean returnRental(Long rentalId) {
        return rentalRepository.updateReturnedAt(rentalId) > 0;
    }
}
