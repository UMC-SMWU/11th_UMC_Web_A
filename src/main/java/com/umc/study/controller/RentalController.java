package com.umc.study.controller;

import com.umc.study.service.RentalService;
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
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(@RequestBody Map<String, Object> body) {
        Long userId = ((Number) body.get("userId")).longValue();
        Long bookId = ((Number) body.get("bookId")).longValue();

        Long rentalId = rentalService.createRental(userId, bookId);

        // 성공하면 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "대여 기록이 생성되었습니다.",
                "rentalId", rentalId,
                "affectedRows", 1
        ));
    }

    // [선택] PATCH http://localhost:8080/rentals/1/return
    @PatchMapping("/{rentalId}/return")
    public ResponseEntity<Map<String, Object>> returnRental(@PathVariable Long rentalId) {
        if (!rentalService.returnRental(rentalId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", "해당 대여 기록이 없습니다.",
                    "rentalId", rentalId
            ));
        }
        return ResponseEntity.ok(Map.of(
                "message", "반납 처리되었습니다.",
                "rentalId", rentalId,
                "affectedRows", 1
        ));
    }
}
