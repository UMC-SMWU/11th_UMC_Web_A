package com.umc.study.controller;

import com.umc.study.dto.CreateRentalRequest;
import com.umc.study.service.RentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // [미션 2] POST http://localhost:8080/rentals   Body: { "userId": 1, "bookId": 1 }
    // @Valid: userId, bookId가 없으면 Service에 닿기 전에 400으로 응답한다.
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(@Valid @RequestBody CreateRentalRequest request) {
        Long rentalId = rentalService.createRental(request.userId(), request.bookId());

        // 성공하면 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "대여 기록이 생성되었습니다.",
                "rentalId", rentalId,
                "affectedRows", 1
        ));
    }

    // [선택] PATCH http://localhost:8080/rentals/1/return
    // 없는 대여 기록은 404, 이미 반납한 기록은 409로 응답한다. (예외는 GlobalExceptionHandler가 처리)
    @PatchMapping("/{rentalId}/return")
    public ResponseEntity<Map<String, Object>> returnRental(@PathVariable Long rentalId) {
        rentalService.returnRental(rentalId);

        return ResponseEntity.ok(Map.of(
                "message", "반납 처리되었습니다.",
                "rentalId", rentalId,
                "affectedRows", 1
        ));
    }
}
