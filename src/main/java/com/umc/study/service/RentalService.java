package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public void createRental(Map<String, Object> body) {
        rentalRepository.save(body);
    }

    // 반납 성공 여부를 boolean으로 돌려줌
    public boolean returnBook(Long rentalId) {
        return rentalRepository.updateReturnedAt(rentalId) > 0;
    }
}